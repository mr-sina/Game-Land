import Game from '../models/game'
import Seller from '../models/seller'
import {validationResult} from "express-validator"
import JsError from "./error"
import mongoose from 'mongoose';
import Image from '../models/image';
import VR from '../middlewares/validators/validationResult';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface GameInterface {
    imageId: string[],
    title: string,
    price:number,
    description: string,
    discount:mongoose.Types.ObjectId,
    seller: mongoose.Types.ObjectId,
}
interface GameSellerType {
    sellerId:mongoose.Types.ObjectId,
    GameId:mongoose.Types.ObjectId,
    price:Number,
    quantity:Number,
    guarantee:String,
    warehouse:Boolean,
    colors:string[],
}


/**
 * @description seller/ add  function
 * @description this function is for adding GameSeller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */

 interface SellerInterface {
  firstName: string,
  lastName: string,
  password: string,
  juridical: boolean,
  birthday: Date,
  personalId: Number,
  address: string,
  city: string,
  province: string,
  postalCode: string,
  location: {
      long: Number,
      lat: Number,
  },
  phoneNumber: Number,
  email:string,
  shopName: string,
  shabaNumber: Number,
  categories: string[],
  nationalId: string,
  registrationCode: Number
}

interface Auth {
  phoneNumber: Number,
  password?: string,
}

export async function signUp(req, res, next): Promise<void> {

  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {

    const sellerInfo: SellerInterface = req.body;
    const seller = await Seller.findOne({ phoneNumber : sellerInfo.phoneNumber });
    if (seller) {
      return res.json("phone number is already taken")
    }

    sellerInfo.password = await bcrypt.hash(sellerInfo.password, 12);
    
    //jwt
    const token = await jwt.sign({ phoneNumber: sellerInfo.phoneNumber }, process.env.USER_JWT , { expiresIn: "3d" })
    const newUser = await new Seller({
      ...sellerInfo,
      token: token
    })
    await newUser.save();

    return res.json({
      message: newUser,
    })


  } catch (error) {
    console.log(error);
    next(error)
  }
};

export async function login({body}: { body: Auth },req, res, next): Promise<void> {
  const {phoneNumber, password} = body
  try {
      let seller: any = await Seller.findOne({phoneNumber})
      if (!seller) {
          const error: JsError = new Error('A seller with this email could not be found.')
          error.statusCode = 401
          next(error)
      }
      if (req.body.remember) {
          seller.setRememberToken(res);
        }
      const match = await bcrypt.compare(password, seller.password)
      if (!match) {
          const error: JsError = new Error('Wrong password!')
          error.statusCode = 401
          next(error)
      }
      const token = await jwt.sign(phoneNumber , process.env.USER_JWT , { expiresIn: "3d" })
      res.status(200).json({token, sellerId: seller._id.toString()})
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500
      }
      next(err)
  }
}


export async function newPassword(req, res, next) {
  const {newPassword, sellerId, token} = req.body
  try {
      const resetSeller: any = await Seller.findOne({
          resetToken: token,
          resetTokenExpiration: {$gt: Date.now()},
          _id: sellerId
      })
      resetSeller.password = await bcrypt.hash(newPassword, 12)
      resetSeller.resetToken = undefined
      resetSeller.resetTokenExp = undefined
      await resetSeller.save()
  } catch (err) {
      const error: JsError = new Error(err);
      error.statusCode = 500;
      return next(error);
  }
}


export async function update(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const {sellerId} = req.params
  const sellerInfo: SellerInterface = req.body
  try {
      let seller: any = Seller.findById(sellerId)
      if (!seller) {
          const error: JsError = new Error('Could not find seller')
          error.statusCode = 404
          next(error)
      }
      seller = sellerInfo
      const result = await seller.save()
      res.status(201).json({message: 'seller updated!', sellerId: result._id})
  } catch (err) {
      err.statusCode || 500
      next(err)
  }
}


export async function  createGameSeller(req, res, next) {
    const errors = VR(req);
    if (errors.length > 0) {
      return res.status(400).json({ msg: errors[0], success: false });
    }
    try {
      //console.log(req.body);
      //console.log(req.files);
      //console.log(req.files.image[0].filename)
      const imageArr: any = [];
      imageArr.push(req.files.image)
      let imageId: any = [];
    
      for(let i = 0; i < imageArr[0].length; i++){
        await new Image({
          url : req.files.image[i].filename,
          alt : req.body.alt,
          meta : req.body.meta
        }).save()
        imageId.push(new mongoose.Types.ObjectId())
      }
     
      const GameInfo: GameSellerType = req.body;
      const newGame = await new Seller({
        imageId : imageId,
        ...GameInfo,
        sellerId : req.sellerId
      });
      await newGame.save();
  
      return res.json({
        message : newGame
      })
  
    } catch (err) {
      next(err);
    } 
}

/**
 * @description s/ add admin function
 * @description this function is for adding admin
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateGameSeller(req, res, next) {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          const foundGame = await Seller.findById(req.params.id);
          if(! foundGame){
            return res.json({
              message : 'Game not found'
            })
          }
        const updateProSeller:GameSellerType=req.body
        const updateGame = await Seller.findOneAndUpdate({ _id : req.params.id }, { $set:updateProSeller});
        return res.json({
            message: "update Game successfuly",
            updateGame
        });
      } else{
        return res.json({
          message: "Game not fount with this id."
      });
      }
      } catch (err) {
        next(err);
      }
}

/**
 * @description admin/ add admin function
 * @description this function is for adding admin
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */

export async function removeGameSeller(req, res, next) {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          const foundGame = await Seller.findById(req.params.id);
          if(! foundGame){
            return res.json({
              message : 'Game not found'
            })
          }
          await Seller.deleteOne({ _id: req.params.id });
          return res.json({
            message: "delete Game successfuly"
          });
        }
        else {
            return res.json({
              message: "Game not fount with this id."
          });
        }
      } catch (err) {
        next(err);
      } 
}


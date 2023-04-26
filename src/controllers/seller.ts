import Game from "../models/game";
import Seller from "../models/seller";
import { validationResult } from "express-validator";
import JsError from "./error";
import mongoose from "mongoose";
import Image from "../models/image";
import VR from "../middlewares/validators/validationResult";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import category from "../models/category";
import discount from "../models/discount";

interface GameInterface {
  imageId: string[];
  title: string;
  price: number;
  description: string;
  discount: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
}
interface SellerInterface {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  personalId: Number;
  address: string;
  city: string;
  province: string;
  shopName: string;
  shabaNumber: Number;
}

interface Auth {
  phoneNumber: Number;
  password?: string;
}

/**
 * @description seller/ register seller function
 * @description this function is for register
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function signUp(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {
    const sellerInfo: SellerInterface = req.body;
    const seller = await Seller.findOne({
      phoneNumber: sellerInfo.phoneNumber,
    });
    if (seller) {
      return res.json("phone number is already taken");
    }

    sellerInfo.password = await bcrypt.hash(sellerInfo.password, 12);

    //jwt
    const token = await jwt.sign(
      { sellerId: seller._id.toString() },
      process.env.USER_JWT,
      { expiresIn: "3d" }
    );
    const newUser = await new Seller({
      ...sellerInfo,
      token: token,
    });
    await newUser.save();

    return res.json({
      message: newUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description seller/ login seller function
 * @description this function is for login
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function login(req, res, next): Promise<void> {
  const { phoneNumber, password } = req.body;
  try {
    let seller: any = await Seller.findOne({ phoneNumber });
    if (!seller) {
      const error: JsError = new Error(
        "A seller with this email could not be found."
      );
      error.statusCode = 401;
      next(error);
    }
    const match = await bcrypt.compare(password, seller.password);
    if (!match) {
      const error: JsError = new Error("Wrong password!");
      error.statusCode = 401;
      next(error);
    }
    const token = await jwt.sign(
      { sellerId: seller._id.toString() },
      process.env.USER_JWT,
      { expiresIn: "3d" }
    );
    res.status(200).json({ token, sellerId: seller._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

/**
 * @description seller/ edit seller function
 * @description this function is for edit seller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function edit(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { sellerId } = res.auth;
  const sellerInfo: SellerInterface = req.body;
  try {
    let seller: any = Seller.findById(sellerId);
    if (!seller) {
      const error: JsError = new Error("Could not find seller");
      error.statusCode = 404;
      next(error);
    }

    const result = await Seller.findByIdAndUpdate(sellerId, {
      $set: sellerInfo,
    });
    res.status(201).json({ message: "seller updated!", sellerId: result._id });
  } catch (err) {
    err.statusCode || 500;
    next(err);
  }
}

/**
 * @description seller/ create game of seller function
 * @description this function is for creating game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function createGameSeller(req, res, next) {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { sellerId } = res.auth;

  const imageArr: any = [];
  let imageId: any = [];
  try {
    if (req.body.category) {
      const foundCategory = await category.findById(req.body.category);
      if (!foundCategory) {
        return res.json({
          message: "category not found",
        });
      }
    }
    if (req.body.discount) {
      const foundDiscount = await discount.findById(req.body.discount);
      if (!foundDiscount) {
        return res.json({
          message: "discount not found",
        });
      }
      if (foundDiscount.active == false) {
        return res.json({
          message: "discount is not active",
        });
      }
      if (foundDiscount.expire < new Date()) {
        return res.json({
          message: "discount is expired",
        });
      }
    }
    if (req.files) {
      imageArr.push(req.files.image);
      for (let i = 0; i < imageArr[0].length; i++) {
        await new Image({
          url: req.files.image[i].filename,
          alt: req.body.alt,
          meta: req.body.meta,
        }).save();
        imageId.push(new mongoose.Types.ObjectId());
      }
    }
    const GameInfo: GameInterface = req.body;
    const newGame = await new Game({
      imageId: imageId,
      ...GameInfo,
      seller: sellerId,
    });
    await newGame.save();

    return res.json({
      message: newGame,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description seller/ update game of seller function
 * @description this function is for updating game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateGameSeller(req, res, next) {
  const { sellerId } = res.auth;

  const imageArr: any = [];
  let imageId: any = [];
  try {
    if (req.body.category) {
      const foundCategory = await category.findById(req.body.category);
      if (!foundCategory) {
        return res.json({
          message: "category not found",
        });
      }
    }
    if (req.body.discount) {
      const foundDiscount = await discount.findById(req.body.discount);
      if (!foundDiscount) {
        return res.json({
          message: "discount not found",
        });
      }
      if (foundDiscount.active == false) {
        return res.json({
          message: "discount is not active",
        });
      }
      if (foundDiscount.expire < new Date()) {
        return res.json({
          message: "discount is expired",
        });
      }
    }
    if (req.files) {
      imageArr.push(req.files.image);
      for (let i = 0; i < imageArr[0].length; i++) {
        await new Image({
          url: req.files.image[i].filename,
          alt: req.body.alt,
          meta: req.body.meta,
        }).save();
        imageId.push(new mongoose.Types.ObjectId());
      }
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundGame = await Game.findById(req.params.id);
      if (!foundGame) {
        return res.json({
          message: "Game not found",
        });
      }
      if (foundGame.seller != sellerId.toString()) {
        return res.json({
          message: "you are not owner of this game",
        });
      }
      const updateGameSeller: GameInterface = req.body;
      updateGameSeller.imageId = imageId;
      const updateGame = await Game.findOneAndUpdate(
        { _id: foundGame._id },
        { $set: updateGameSeller },
        { new: true }
      );
      return res.json({
        message: "update Game successfuly",
        updateGame,
      });
    } else {
      return res.json({
        message: "Game not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description seller/ remove Game of seller function
 * @description this function is for removing game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */

export async function removeGameSeller(req, res, next) {
  const { sellerId } = res.auth;
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundGame = await Game.findById(req.params.id);
      if (!foundGame) {
        return res.json({
          message: "Game not found",
        });
      }
      if (foundGame.seller != sellerId.toString()) {
        return res.json({
          message: "you are not owner of this game",
        });
      }
      await Game.deleteOne({ _id: req.params.id });
      return res.json({
        message: "delete Game successfuly",
      });
    } else {
      return res.json({
        message: "Game not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

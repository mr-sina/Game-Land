import VR from "../middlewares/validators/validationResult";
import mongoose from "mongoose";
import User from "../models/user";
import Comment from "../models/comment";
import Game from "../models/game";
import Order from "../models/order";
import Payment from "../models/payment";
// import axios from "axios";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UserInfo } from "os";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface CommentType {
  text: string;
  title: string;
  cons: string;
  pros: string;
}


const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "16dbd3d3135b2d",
    pass: "6cea96dcb0c8d7"
  }
});
export async function edit(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const {id} = req.params
  const userInfo: UserType = req.body
  try {
      let seller: any = User.findById(id)
      if (!seller) {
          const error= new Error('Could not find seller')
          next(error)
      }
      
      const result = await User.findByIdAndUpdate(id,{ $set: userInfo })
      res.status(201).json({message: 'seller updated!', sellerId: result._id})
  } catch (err) {
      err.statusCode || 500
      next(err)
  }
}

/**
 * @description user register function 
 * @description register with jwt and token
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a token and json message
 */
export async function register(req, res, next): Promise<void> {

  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {

    const userInfo: UserType = req.body;
   
    const user = await User.findOne({ email : userInfo.email });
    if (user) {
      return res.json("email is already taken")
    }

    userInfo.password = await bcrypt.hash(userInfo.password, 12);
    
    //jwt
    const token = await jwt.sign({userId: user._id }, process.env.USER_JWT , { expiresIn: "3d" })
    const newUser = await new User({
      ...userInfo,
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

/**
 * @description user login function 
 * @description login with jwt and token
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a token and json message
 */
export async function login(req, res, next): Promise<void> {

  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email })

    if (!user) {
      return res.json("Invalid email or password")
    }

    const is_Match = await bcrypt.compare(password, user['password']);
   
    if (!is_Match) {
      return res.json("Incorrect email or password")
    }

    const token = await jwt.sign({userId: user._id }, process.env.USER_JWT , { expiresIn: "3d" })

    return res.json({
      message: 'Auth successful',
      token: token
    })

  } catch (error) {
    console.log(error)
    next(error)
  }

};


/**
 * @description user new password function
 * @description this function is for setting new password
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function newPassword(req, res, next) {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
      return res.status(400).json({ msg: errors[0], success: false });
  }
  try{
    const newPassword = req.body.password;
    const user: any = await User.findOne({ $and : [{email : req.body.email , resetToken : req.body.token}] });
    if(! user) {
      return res.json('No account with that email found.')
    }
    if(user.resetToken == undefined){
      return res.json('This link has already been used to change the password')
    }
    await User.findOneAndUpdate({ email : req.body.email} , {$set : { password :  await bcrypt.hash(newPassword , 12) , resetToken : undefined , resetTokenExp : undefined} })
   
    return res.json({
      message: 'Password edited successfully',
    })

  } catch(err){
    console.log(err);
    next(err)
  }
 
}
/**
 * @description get users function 
 * @description list all users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of users 
 */
 export async function getUsers(req, res, next): Promise<void> {

  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {

    const sort = req.body.sort;
    const skip = req.body.skip;
    const users = await User.find({},{firstName:1,lastName:1,}).skip(skip).sort(sort)

    return res.json({
      message: 'Auth successful',
      users
    })

  } catch (error) {
    console.log(error)
    next(error)
  }

};

/**
 * @description user/ add comments function
 * @description this function is for adding comments
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addComments(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {
    const prodId = req.body.GameId;
    const foundGame = await Game.findById(prodId);
    if (!foundGame) {
      return res.json("Game not found");
    }
    const commentInfo: CommentType = req.body;
    const comment = await new Comment({
      userId: req.user,
      ...commentInfo,
    });
    await comment.save();
    return res.json({
      message: comment,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description user/ cart function
 * @description this is the cart function that store the cart items in it
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function cart(req, res, next): Promise<void> {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.json("user not found");
    }
    return res.json({
      cart: user.cart,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description user/ add to cart function
 * @description this function is for adding items to cart
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addToCart(req, res, next): Promise<void> {
  try {
    const userId = req.body.userId;
    const prodId = req.body.GameId;

    const foundGame = await Game.findById(prodId);
    if (!foundGame) {
      return res.json("Game not found");
    }

    const user: any = await User.findById(userId);
    if (!user) {
      return res.json("user not found");
    }

    const newCartItem = await new User({
      cart: prodId,
    }).save();

    await user.cart.push(newCartItem);
    await user.save();

    return res.json({
      newCartItem,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description user/ delete from cart function
 * @description this function is for deleting items from cart
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteFromCart(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const userId = req.body.userId;

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.json("cart item not found");
      }
      user.remove();

      let index = user.cart.indexOf(req.params.id);
      user.items.splice(index, 1);

      return res.json({
        message: "delete from cart successfuly",
      });
    } else {
      return res.json({
        message: "invalid id",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description user/ create order function
 * @description this function is for creating order
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function createOrder(req, res, next): Promise<void> {
  try {
    const cartitems = [];
    const cartId = req.body.cartId;

    const foundCart: any = await User.findById(cartId);
    if (!foundCart) {
      return res.json("cart not found");
    }
    foundCart.items.forEach((item) => {
      cartitems.push(item);
    });

    const newOrder = await new Order({
      userId: "5fc7b0e7f901303484e370c0",
      state: req.body.state,
      deliverMethod: req.body.deliverMethod,
      paymentMethod: req.body.paymentMethod,
      receiveTime: req.body.receiveTime,
      item: cartitems,
    }).save();

    //payment

    await foundCart.remove();

    return res.json({
      newOrder,
    });
  } catch (err) {
    next(err);
  }
}

// /**
//  * @description payment function
//  * @description this function is for pending by zarinpal
//  * @param {Object} req
//  * @param {Object} res
//  * @param {Object} next
//  * @returns {Promise} returns a json message
//  */
// export async function payment(req, res, next): Promise<void> {
//   try {
//     //payment params
//     let params = {
//       MerchantID: "6cded376-3063-11e9-a98e-005056a205be",
//       Amount: req.body.amount,
//       CallbackURL: `http://localhost:${process.env.PORT}/paycallback`,
//       Description: "payment with zarinpal",
//     };

//     //payment
//     const response = await axios.post(
//       "https://sandbox.zarinpal.com/pg/services/WebGate/wsdl",
//       params
//     );
//     //console.log(response);
//     if (response.data.Status == 100) {
//       const newPayment = await new Payment({
//         user: "5fc7b0e7f901303484e370c0",
//         amount: req.body.amount,
//         resnumber: response.data.Authority,
//       }).save();

//       return res.json({
//         newPayment,
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * @description paycallback function
//  * @param {Object} req
//  * @param {Object} res
//  * @param {Object} next
//  * @returns {Promise} returns a json message
//  */
// export async function paycallback(req, res, next): Promise<void> {
//   try {
//     let payment: any = await Payment.findOne({
//       resnumber: req.query.Authority,
//     });
//     if (!payment) return res.send("No such transaction");
//     let params = {
//       MerchantID: "6cded376-3063-11e9-a98e-005056a205be",
//       Amount: payment.amount,
//       Authority: req.query.Authority,
//     };

//     const response = await axios.post(
//       "https://sandbox.zarinpal.com/pg/services/WebGate/wsdl",
//       params
//     );
//     if (response.data.Status != 100) {
//       let balance = payment.amount;
//       let user: any = await User.findById(payment.userId);
//       if (user.balance) {
//         balance += user.balance;
//       }
//       user.balance = balance;
//       payment.payment = true;
//       await user.save();
//       await payment.save();
//     } else {
//       return res.send("payment failed");
//     }
//   } catch (err) {
//     next(err);
//   }
// }

/**
 * @description admin/ update admin function  =>  WRONG
 * @description this function is for show users informations
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function UserInfos(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      
      const UserInfo: UserType = req.body;

      const UserFounded = await User.findOne({ email: UserInfo.email });
      if (UserFounded) {
        return res.json("User found");
      }
    } else {
      return res.json({
        message: "User not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ update admin function  =>  WRONG
 * @description this function is for edit User informations
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function editUser(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundUser = await User.findById(req.params.id);
      if (!foundUser) {
        return res.json({
          message: "User not found",
        });
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body }
      );

      return res.json({
        message: "edit User successfuly",
        updateUser,
      });
    } else {
      return res.json({
        message: "User not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

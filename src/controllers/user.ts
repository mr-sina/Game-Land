import VR from "../middlewares/validators/validationResult";
import mongoose from "mongoose";
import User from "../models/user";
import Comment from "../models/comment";
import Game from "../models/game";
import Order from "../models/order";
import Payment from "../models/payment";
// import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { UserInfo } from "os";
import discount from "../models/discount";
import game from "../models/game";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface OrderType {
  userId: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  state: String;
  deliverMethod: String;
  paymentMethod: String;
}
interface CommentType {
  text: string;
  title: string;
  cons: string[];
  pros: string[];
  gameId: mongoose.Types.ObjectId;
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

    const user = await User.findOne({ email: userInfo.email });
    if (user) {
      return res.json("email is already taken");
    }

    userInfo.password = await bcrypt.hash(userInfo.password, 12);

    //jwt
    const token = await jwt.sign({ userId: user._id }, process.env.USER_JWT, {
      expiresIn: "3d",
    });
    const newUser = await new User({
      ...userInfo,
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.json("Invalid email or password");
    }

    const is_Match = await bcrypt.compare(password, user["password"]);

    if (!is_Match) {
      return res.json("Incorrect email or password");
    }

    const token = await jwt.sign({ userId: user._id }, process.env.USER_JWT, {
      expiresIn: "3d",
    });

    return res.json({
      message: "Auth successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description user/ add comments function
 * @description this function is for adding comments
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addComment(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { userId } = res.auth;
  const { gameId } = req.body;
  try {
    const foundGame = await Game.findById(gameId);
    if (!foundGame) {
      return res.json("game not found");
    }
    const commentInfo: CommentType = req.body;
    const comment = await new Comment({
      userId,
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
 * @description user/ delete comment function
 * @description this is deleting comment function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteComment(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { userId } = res.auth;
  try {
    const foundComment = await Comment.findById(req.params.id);
    if (!foundComment) {
      return res.json("Comment not found");
    }
    if (foundComment.userId != userId.toString()) {
      return res.json("this is not your comment");
    }

    await foundComment.delete();
    return res.json({
      message: foundComment,
      result: "deleted successfully",
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
    const { userId } = res.auth;

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
  const { userId } = res.auth;
  const { gameId } = req.body;

  const foundGame = await Game.findById(gameId);
  if (!foundGame) {
    return res.json("Game not found");
  }
  if (foundGame.discount) {
    const foundDiscount = await discount.findById(foundGame.discount);
    if (!foundDiscount) {
      return res.json({
        message: "game discount not found",
      });
    }
    if (foundDiscount.active == false) {
      return res.json({
        message: "game discount is not active",
      });
    }
    if (foundDiscount.expire < new Date()) {
      return res.json({
        message: "game discount is expired",
      });
    }
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $push: { cart: gameId } },
      { new: true }
    );

    return res.json({
      message: "added to cart successfully",
      result: updateUser.cart,
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
      const { userId } = res.auth;

      const user = await User.findById(userId);
      if (!user) {
        return res.json("user not found");
      }

      let items = [];
      let counter = 0;
      let index = user.cart.indexOf(req.params.id);
      for (const e of user.cart) {
        if (index != counter) items.push(e);
        counter++;
      }

      await user.update({ $set: { cart: items } });
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
    let cartItems = [];
    let totalPrice = 0;
    const { userId } = res.auth;
    const { deliverMethod, paymentMethod } = req.body;
    const foundUser: any = await User.findById(userId);
    if (!foundUser) {
      return res.json("user not found");
    }
    if (foundUser.cart.length == 0) {
      return res.json("user cart is empty");
    }
    for (let i = 0; i < foundUser.cart.length; i++) {
      let foundGame = await game.findById(foundUser.cart[i]);
      if (foundGame.discount) {
        const foundedDiscount = await discount.findById(foundGame.discount);

        if (
          foundedDiscount.active != false &&
          foundedDiscount.expire > new Date() &&
          foundedDiscount
        ) {
          foundGame.price -= (foundedDiscount.percent * foundGame.price) / 100;
        }
      }
      totalPrice += foundGame.price;
    }

    const newOrder = await new Order({
      userId,
      items: foundUser.cart,
      deliverMethod,
      paymentMethod,
      state: "in-progress",
      totalPrice,
    }).save();
    // await foundUser.update({ $set: { cart: [] } });
    return res.json({
      message: "order created successfully",
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
  const { userId } = res.auth;
  try {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const foundUser = await User.findById(userId);
      if (!foundUser) {
        return res.json({
          message: "User not found",
        });
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
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

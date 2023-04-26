import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../models/admin";
import mongoose from "mongoose";
import User from "../models/user";
import Game from "../models/game";
import Comment from "../models/comment";
import Category from "../models/category";
import Discount from "../models/discount";
import Order from "../models/order";
import VR from "../middlewares/validators/validationResult";
import seller from "../models/seller";
import Image from "../models/image";
import fs from "fs-extra";
import category from "../models/category";

interface AdminType {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}
interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
}
interface SellerType {
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

interface GameType {
  imageId: string[];
  title: string;
  price: number;
  description: string;
  discount: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
}

interface CommentType {
  gameId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  title: string;
  cons: string[];
  pros: string[];
}

interface discountType {
  reason: string;
  code: string;
  maxAmount: Number;
  expire: Date;
  percent: Number;
  quantity: Number;
  active: boolean;
}
interface imageType {
  url: string;
  alt: string;
  meta: string;
}

/**
 * @description admin register function
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
    const adminInfo: AdminType = req.body;

    const admin = await Admin.findOne({ email: adminInfo.email });
    if (admin) {
      return res.json("email is already taken");
    }
    if (req.body.role !== "fullManager" && req.body.role !== "paymentManager") {
      return res.json("choose role correctly");
    }
    adminInfo.password = await bcrypt.hash(adminInfo.password, 12);

    //jwt
    const token = await jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_JWT,
      { expiresIn: "3d" }
    );
    const newAdmin = await new Admin({
      ...adminInfo,
      token: token,
    });
    await newAdmin.save();

    return res.json({
      message: newAdmin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description admin login function
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
    const { email, password } = req.body;
    const admin: any = await Admin.findOne({ email: email });

    if (!admin) {
      return res.json("Invalid email or password");
    }

    //remember me
    if (req.body.remember) {
      admin.setRememberToken(res);
    }

    const is_Match = await bcrypt.compare(password, admin.password);

    if (!is_Match) {
      return res.json("Incorrect email or password");
    }

    const token = await jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_JWT,
      {
        expiresIn: "3d",
      }
    );

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
 * @description admin/ add admin function
 * @description this function is for adding admin
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addAdmin(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    const adminInfo: AdminType = req.body;

    const admin = await Admin.findOne({ email: adminInfo.email });
    if (admin) {
      return res.json("email is already taken");
    }

    adminInfo.password = await bcrypt.hash(adminInfo.password, 12);
    if (
      req.body.role != "paymentManager" ||
      req.body.role != "supportManager"
    ) {
      return res.json("choose role correctly");
    }
    //jwt
    const token = await jwt.sign(
      { adminId: admin._id.toString() },
      process.env.ADMIN_JWT,
      { expiresIn: "3d" }
    );
    const newAdmin = await new Admin({
      ...adminInfo,
      token: token,
    });
    await newAdmin.save();

    return res.json({
      message: newAdmin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
/**
 * @description admin/ update admin function
 * @description this function is for updating admin
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateAdmin(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { adminId } = res.auth;
  const foundAdmin = await Admin.findById(adminId);
  if (foundAdmin.role != "fullManager") {
    return res.json({
      message: "you are not full manager",
    });
  }
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundAdmin = await Admin.findById(req.params.id);
      if (!foundAdmin) {
        return res.json({
          message: "admin not found",
        });
      }
      const updateAdmin = await Admin.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );

      return res.json({
        message: "update admin successfuly",
        updateAdmin,
      });
    } else {
      return res.json({
        message: "admin not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ delete admin function
 * @description this function is for deleting admin
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteAdmin(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundAdmin = await Admin.findById(req.params.id);
      if (!foundAdmin) {
        return res.json({
          message: "admin not found",
        });
      }
      await Admin.deleteOne({ _id: req.params.id });
      return res.json({
        message: "delete admin successfuly",
      });
    } else {
      return res.json({
        message: "admin not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ add user function
 * @description this function is for adding user
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addUser(req, res, next): Promise<void> {
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
    const token = await jwt.sign(
      { userId: user._id.toString() },
      process.env.USER_JWT,
      { expiresIn: "3d" }
    );
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
 * @description admin/ update user function
 * @description this function is for updating user
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateUser(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundUser = await User.findById(req.params.id);
      if (!foundUser) {
        return res.json({
          message: "user not found",
        });
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      return res.json({
        message: "update user successfuly",
        updateUser,
      });
    } else {
      return res.json({
        message: "user not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ delete user function
 * @description this function is for deleting user
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteUser(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundUser = await User.findById(req.params.id);
      if (!foundUser) {
        return res.json({
          message: "user not found",
        });
      }
      await User.deleteOne({ _id: req.params.id });
      return res.json({
        message: "delete user successfuly",
      });
    } else {
      return res.json({
        message: "user not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ add Game function
 * @description this function is for adding Game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addGame(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
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
      const foundDiscount = await Discount.findById(req.body.discount);
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

    const GameInfo: GameType = req.body;
    const newGame = await new Game({
      imageId: imageId,
      ...GameInfo,
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
 * @description admin/ update Game function
 * @description this function is for updating Game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateGame(req, res, next): Promise<void> {
  let imageArr = [];
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
      const foundDiscount = await Discount.findById(req.body.discount);
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
      // try {
      //   var found = Image.find(function (element) {
      //     // return element > 4;
      //   });
      //   const file = await fs.ensureFile("/Game/update/" + req.body.image);
      //   if (!file) {
      //     return res.json({
      //       message: "image not found",
      //     });
      //   }
      //   await fs.remove("/Game/update/" + req.body.image);
      //   //   imageArr.push( mongoose.Types.ObjectId())
      //   res.json({ message: "remove image successful" });
      // } catch (err) {
      //   res.json({ message: "remove image failed" });
      // }
      // // imageArr.push(req.files.image)
      // // imageArr.push(new mongoose.Types.ObjectId())
      // const imageUpdateType: imageType = req.body.Image;
      // const updateImage = await Image.findOneAndUpdate(
      //   { _id: req.params.id },
      //   { $set: imageUpdateType }
      // );
      const gameInfo: GameType = req.body;
      gameInfo.imageId = imageId;
      const updateGame = await Game.findOneAndUpdate(
        { _id: req.params.id },
        { $set: gameInfo },
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
 * @description admin/ delete Game function
 * @description this function is for deleting Game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteGame(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundGame = await Game.findById(req.params.id);
      if (!foundGame) {
        return res.json({
          message: "Game not found",
        });
      }
      await Game.deleteOne({ _id: req.params.id });
      return res.json({
        message: "delete Game successfuly",
        Game,
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
 * @description admin/ add comments function
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
  const { gameId } = req.body;
  const foundedGame = await Game.findById(gameId);
  if (!foundedGame) {
    return res.json({
      message: "game not found",
    });
  }
  try {
    const commentInfo: CommentType = req.body;
    const comment = await new Comment({
      ...commentInfo,
    });
    await comment.save();
    return res.json({
      message: comment,
      result: "added successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ all comments function
 * @description this function is for showing all comments
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function getComments(req, res, next): Promise<void> {
  const { limit, skip, sort } = req.body;
  try {
    const allComments = await Comment.find().limit(limit).skip(skip).sort(sort);

    return res.json({
      message: allComments,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ delete comment function
 * @description this function is for deleting comment
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteComment(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const comment: any = await Comment.findById(req.params.id);
      if (!comment) {
        return res.json("There is not any comment with this id");
      }
      await comment.remove();

      return res.json({
        message: "delete comment successfuly",
      });
    } else {
      return res.json({
        message: "comment not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ add category function
 * @description this function is for adding category
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addCategory(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  const { name, parentId } = req.body;
  let imageId: any;

  try {
    if (req.files) {
      await new Image({
        url: req.files.image[0].filename,
        alt: req.body.alt,
        meta: req.body.meta,
      }).save();
      imageId = new mongoose.Types.ObjectId();
    }

    const category = await new Category({
      name,
      imageId,
      parentId,
    });
    await category.save();
    return res.json({
      message: "add category successfuly",
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ update category function
 * @description this function is for updating category
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateCategory(req, res, next): Promise<void> {
  let imageId: any;

  const { name, parentId } = req.body;

  try {
    if (req.files) {
      await new Image({
        url: req.files.image[0].filename,
        alt: req.body.alt,
        meta: req.body.meta,
      }).save();
      imageId = new mongoose.Types.ObjectId();
    }
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Category.findByIdAndUpdate(req.params.id, {
        $set: {
          name,
          imageId,
          parentId,
        },
      });

      return res.json({
        message: "update category successfuly",
      });
    } else {
      return res.json("category not fount with this id.");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ delete category function
 * @description this function is for deleting category
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteCategory(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const category: any = await Category.findById(req.params.id)
        .populate("childs")
        .exec();
      if (!category) {
        return res.json("There is not any category with this id");
      }

      await category.childs.forEach((category) => category.remove());

      await category.remove();

      return res.json({
        message: "delete category successfuly",
      });
    } else {
      return res.json("category not fount with this id.");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ update profile function
 * @description this function is for updating profile
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateProfile(req, res, next) {
  const { adminId } = res.auth;
  try {
    if (mongoose.Types.ObjectId.isValid(adminId)) {
      await Admin.findByIdAndUpdate(adminId, { $set: { ...req.body } });
      return res.json({
        message: "update profile successfuly",
      });
    } else {
      return res.json("not fount with this id.");
    }
  } catch (err) {
    next(err);
  }
}

//   /**
//    * @description admin/ update admin function  =>  WRONG
//    * @description this function is for edit admins informations
//    * @param {Object} req
//    * @param {Object} res
//    * @param {Object} next
//    * @returns {Promise} returns a json message
//    */
//   export async function editAdmin(req, res, next): Promise<void> {
//     const errors = VR(req);
//     if (errors.length > 0) {
//       return res.status(400).json({ msg: errors[0], success: false });
//     }
//     try {
//       if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//         const foundAdmin = await Admin.findById(req.params.id);
//         if(! foundAdmin){
//           return res.json({
//             message : 'admin not found'
//           })
//         }
//       const updateAdmin = await Admin.findOneAndUpdate({ _id : req.params.id }, { $set: req.body });

//       return res.json({
//           message: "edit admin successfuly",
//           updateAdmin
//       });
//     } else{
//       return res.json({
//         message: "admin not fount with this id.",
//     });
//     }
//     } catch (err) {
//       next(err);
//     }
//   };

/**
 * @description admin/ all discounts function
 * @description this function is for showing all comments
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function getDiscounts(req, res, next): Promise<void> {
  const { limit, skip, sort } = req.body;
  try {
    const allDiscounts = await Comment.find()
      .limit(limit)
      .skip(skip)
      .sort(sort);

    return res.json({
      message: allDiscounts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ create Discount function
 * @description this function is for add Discount
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function AddDiscount(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    const DiscountInfo: discountType = req.body;
    const discount_find = await Discount.findOne({ code: DiscountInfo.code });
    if (discount_find) {
      return res.json("Discount is already taken");
    }

    const newDiscount = await new Discount({
      ...DiscountInfo,
    });
    await newDiscount.save();

    return res.json({
      message: "Discount added successfully",
      newDiscount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
/**
 * @description admin/ update Discount function
 * @description this function is for update Discount
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function UpdateDiscount(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundDiscound = await Discount.findById(req.params.id);
      if (!foundDiscound) {
        return res.json({
          message: "Discound not found",
        });
      }
      const updateDiscound = await Discount.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      return res.json({
        message: "update Discound successfuly",
        updateDiscound,
      });
    } else {
      return res.json({
        message: "Discound not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}
/**
 * @description admin/ update Discount function
 * @description this function is for delete Discount
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteDiscount(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundDiscount = await Discount.findById(req.params.id);
      if (!foundDiscount) {
        return res.json({
          message: "Discount not found",
        });
      }
      await Discount.deleteOne({ _id: req.params.id });
      return res.json({
        message: "delete Discount successfuly",
      });
    } else {
      return res.json({
        message: "Discount not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ all Orders function
 * @description this function is for showing all orders
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function getOrders(req, res, next): Promise<void> {
  const { limit, skip, sort } = req.body;
  try {
    const allOreders = await Order.find().limit(limit).skip(skip).sort(sort);

    return res.json({
      message: allOreders,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description admin/ choose an order function
 * @description this function is for choosing one order
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function getOrder(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const order: any = await Order.findById(req.params.id);
      if (!order) {
        return res.json("There is not any order with this id");
      }

      return res.json({
        order,
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
 * @description admin/ add seller function
 * @description this function is for adding seller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function addSeller(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  try {
    const sellerInfo: SellerType = req.body;
    const foundSeller = await seller.findOne({
      phoneNumer: sellerInfo.phoneNumber,
    });
    if (foundSeller) {
      return res.json("email is already taken");
    }
    sellerInfo.password = await bcrypt.hash(sellerInfo.password, 12);

    //jwt
    const token = await jwt.sign(
      { userId: foundSeller._id.toString() },
      process.env.USER_JWT,
      { expiresIn: "3d" }
    );
    const newUser = await new User({
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
 * @description seller/ update user function
 * @description this function is for updating seller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function updateSeller(req, res, next): Promise<void> {
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundSeller = await seller.findById(req.params.id);
      if (!foundSeller) {
        return res.json({
          message: "seller not found",
        });
      }
      const updateSeller = await seller.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      return res.json({
        message: "seller user successfuly",
        updateSeller,
      });
    } else {
      return res.json({
        message: "seller not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description seller/ delete user function
 * @description this function is for deleting seller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a json message
 */
export async function deleteSeller(req, res, next): Promise<void> {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const foundSeller = await seller.findById(req.params.id);
      if (!foundSeller) {
        return res.json({
          message: "seller not found",
        });
      }
      await seller.deleteOne({ _id: req.params.id });
      return res.json({
        message: "seller user successfuly",
      });
    } else {
      return res.json({
        message: "seller not fount with this id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

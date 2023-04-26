import express from "express";
const router = express.Router();
// import passport from 'passport';
import * as adminController from "../controllers/admin";

import {
  register,
  login,
  newPassword,
  isAuth,
  createGame,
  editGame,
  category,
  update,
  createUser,
  editUser,
  createSeller,
  editSeller,
  createDiscount,
  editDiscount,
} from "../middlewares/validators/admin";
import { signUp, comment } from "../middlewares/validators/user";

// Add Game File Handler
import APFH from "../middlewares/multer/APFH";
import ACFH from "../middlewares/multer/ACFH";

//login
router.post("/login", ...login, adminController.login);
//register
router.post("/register", ...register, adminController.register);

//add admin
router.post("/create", isAuth, ...register, adminController.addAdmin);
//update admin
router.put("/update/:id", isAuth, ...update, adminController.updateAdmin);
//delete admin
router.delete("/delete/:id", isAuth, adminController.deleteAdmin);
//add user
router.post("/user/create", isAuth, ...createUser, adminController.addUser);
//update user
router.put("/user/update/:id", isAuth, ...editUser, adminController.updateUser);
//delete user
router.delete("/user/delete/:id", isAuth, adminController.deleteUser);

//add user
router.post("/seller/create", isAuth, ...createSeller, adminController.addUser);
//update user
router.put(
  "/seller/update/:id",
  isAuth,
  ...editSeller,
  adminController.updateUser
);
//delete user
router.delete("/seller/delete/:id", isAuth, adminController.deleteUser);

//add Game
router.post("/Game/create", isAuth, createGame, APFH, adminController.addGame);
//update Game
router.put("/Game/update/:id", isAuth, APFH , editGame, adminController.updateGame);
//delete Game
router.delete("/Game/delete/:id", isAuth, adminController.deleteGame);

//comment
router.get("/comment", isAuth, adminController.getComments);
router.post("/comment/create", isAuth, comment, adminController.addComment);
router.delete("/comment/delete/:id", isAuth, adminController.deleteComment);

//orders
router.get("/all-orders", isAuth, adminController.getOrders);
router.get("/order/:id", isAuth, adminController.getOrder);

//category
router.post(
  "/category/create",
  isAuth,
  ...category,
  ACFH,
  adminController.addCategory
);
router.put(
  "/category/update/:id",
  isAuth,
  ACFH,
  adminController.updateCategory
);
router.delete("/category/delete/:id", isAuth, adminController.deleteCategory);

//profile
router.post("/profile/update", isAuth, ...update, adminController.updateProfile);


//discount
router.get("/discounts", isAuth, adminController.getDiscounts);
router.post("/discount/create", isAuth, createDiscount, adminController.AddDiscount);
router.put("/discount/update/:id", isAuth, editDiscount,adminController.UpdateDiscount);
router.delete("/discount/delete/:id", isAuth, adminController.deleteDiscount);

export default router;

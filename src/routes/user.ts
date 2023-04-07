import express from "express";
const router = express.Router();
import * as userController from "../controllers/user";

import {
  signUp,
  login,
  reset,
  newPassword,
  isAuth,
  comment,
} from "../middlewares/validators/user";
//get All
router.get("/get-users", userController.getUsers);
//login
router.post("/login", ...login, userController.login);
//register
router.post("/register", ...signUp, userController.register);
//new password
router.post("/new-password", ...newPassword, userController.newPassword);

//cart
router.post("/cart", isAuth, userController.cart);
router.post("/add-to-cart", isAuth, userController.addToCart);
router.post("/delete-from-cart/:id", isAuth, userController.deleteFromCart);

//order
router.post("/order", isAuth, userController.createOrder);

// //payment
// router.post("/payment", userController.payment);
// router.get("/paycallback", userController.paycallback);

//comment
router.post("/comment/create", isAuth, comment, userController.addComments);

export default router;

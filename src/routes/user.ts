import express from "express";
const router = express.Router();
import * as userController from "../controllers/user";

import {
  signUp,
  login,
  reset,
  newPassword,
  edit,
  isAuth,
  comment,
} from "../middlewares/validators/user";
//login
router.post("/login", ...login, userController.login);
//register
router.post("/register", ...signUp, userController.register);
// edit user infos
router.put("/edit", isAuth, ...edit, userController.editUser);

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
router.post("/comment/create", isAuth, comment, userController.addComment);
router.delete("/comment/delete/:id", isAuth, userController.deleteComment);

export default router;

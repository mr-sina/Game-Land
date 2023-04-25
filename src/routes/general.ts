import express from "express";
const router = express.Router();
import * as generalController from "../controllers/general";

import {
  signUp,
  login,
  reset,
  newPassword,
  edit,
  isAuth,
  comment,
} from "../middlewares/validators/user";
//get All users
router.get("/get-users", generalController.getUsers);
//get All sellers
router.get("/get-sellers", generalController.getSellers);
//get All games
router.get("/get-games", generalController.getGames);
//get All discounts
router.get("/get-discounts", generalController.getDiscounts);

export default router;

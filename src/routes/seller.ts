import express from "express";
const router = express.Router();

import * as sellerController from "../controllers/seller";

import {
  register,
  login,
  smsAuth,
  isAuth,
  Game,
  edit,
} from "../middlewares/validators/seller";
import APFH from "../middlewares/multer/APFH";

//register
router.post("/register", ...register, sellerController.signUp);
//login
router.post("/login", ...login, sellerController.login);


//edit seller info
router.put("/edit/:id",isAuth, ...edit, sellerController.edit);

router.post("/new-password", sellerController.newPassword);


//add game
router.post(
  "/game/creatgameseller",
  isAuth,
  ...Game,
  APFH,
  sellerController.createGameSeller
);
//update game
router.put("/game/update/:id", isAuth, APFH, sellerController.updateGameSeller);
//delete game
router.delete("/game/delete/:id", isAuth, sellerController.removeGameSeller);

export default router;
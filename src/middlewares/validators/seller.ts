import { body } from "express-validator/check";
import Seller from "../../models/seller";
import JsError from "../../controllers/error";

const jwt = require("jsonwebtoken");

export const register = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (email) => {
      const seller = await Seller.findOne({ email });
      if (seller) {
        return Promise.reject("E-Mail address already exists!");
      }
    })
    .normalizeEmail(),

  body("password", "Password should be at least 4 characters")
    .trim()
    .isLength({ min: 4 }),

  body("phoneNumber")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("Please enter a valid mobile number.")
    .custom(async (phoneNumber) => {
      if (phoneNumber.slice(0, 2) !== "09") {
        return Promise.reject("Please enter a valid mobile number.");
      }
      const seller = await Seller.findOne({ phoneNumber });
      if (seller) {
        return Promise.reject("Mobile number already exists!");
      }
    }),
  body("firstName", "please enter your first name correctly ").not().isEmpty(),
  body("lastName", "please enter your last name correctly ").not().isEmpty(),
];
export const Game = [
  body('title', 'please choose title').not().isEmpty(),
  body('price', 'please choose price').not().isEmpty(),
  body('description', 'please choose description').optional(),
  body('discount', 'please choose discount').optional(),
  body('imageId', 'please choose imageId').optional()
]

export const smsAuth = [
  body("phoneNumber", "please enter your mobile number correctly")
    .not()
    .isEmpty()
    .custom(async (mobileNumber) => {
      if (mobileNumber.slice(0, 2) !== "09") {
        return Promise.reject("please enter your mobile number correctly");
      }
    }),
];
export const reset = [body("email", "please enter email correctly ").isEmail()];
export const login = [
  body("email", "please enter email correctly ").isEmail(),
  body("password", "please enter password correctly ").isLength({ min: 5 }),
];
export const edit = [
  body("email", "please enter email correctly ").optional(),
  body("password", "please enter password correctly ").optional().isLength({ min: 5 }),
  body("phoneNumber", "please enter phoneNumber correctly ").optional().isEmpty()
    .isLength({ max: 11 })
    .custom(async (mobileNumber) => {
      if (mobileNumber.slice(0, 2) !== "09") {
        return Promise.reject("please enter your mobile number correctly");
      }
    }),
  body("firstName", "please enter firstName correctly ").optional(),
  body("lastName", "please enter lastName correctly ").optional(),
  body("personalId", "please enter personalId correctly ").optional().isLength({ min: 9 }),
  body("address", "please enter address correctly ").optional().isLength({min:2, max: 30 }),
  body("city", "please enter city correctly ").optional().isLength({ min: 3 }),
  body("province", "please enter province correctly ").optional().isLength({ min: 1 }),
  body("shopName", "please enter shopName correctly ").optional(),
  body("shabaNumber", "please enter shabaNumber correctly ").optional().isLength({
    min: 24,
    max: 26,
  }),
];
export const newPassword = [
  body("email", "please enter email correctly ").isEmail(),
  body("password", "please enter password correctly ").isLength({ min: 4 }),
];

/**
 * @description seller/ isAuth function
 * @description this function is for checking seller authorization
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
export function isAuth(req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    console.log(authHeader);
    jwt.verify(authHeader, process.env.ADMIN_JWT, (err, decodedToken) => {
      console.log(decodedToken);
      if (err || !decodedToken) {
        console.log(err);
        return res.status(401).send("not authorized");
      }
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send("not authorized");
  }
}

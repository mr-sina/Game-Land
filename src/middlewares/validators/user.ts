import { body, param, validationResult } from "express-validator";
const jwt = require("jsonwebtoken");

export const signUp = [
  body("firstName", "please enter your first name correctly ").not().isEmpty(),
  body("lastName", "please enter your last name correctly ").not().isEmpty(),
  body("email", "please enter email correctly ").isEmail(),
  body("password", "please enter password correctly ").isLength({ min: 4 }),
];

export const login = [
  body("email", "please enter email correctly ").isEmail(),
  body("password", "please enter password correctly ").isLength({ min: 4 }),
];

export const edit = [
  body("email", "please enter email correctly ").optional(),
  body("password", "please enter password correctly ")
    .optional()
    .isLength({ min: 5 }),
  body("firstName", "please enter firstName correctly ").optional(),
  body("lastName", "please enter lastName correctly ").optional(),
];

export const reset = [body("email", "please enter email correctly ").isEmail()];

export const newPassword = [
  body("email", "please enter email correctly ").isEmail(),
  body("password", "please enter password correctly ").isLength({ min: 5 }),
];

export const comment = [
  body("title", "please enter the title correctly").isLength({ min: 3 }),
  body("text", "please enter the text correctly").isLength({ min: 5 }),
  body("gameId", "please enter the gameId").not().isEmpty(),
];
export const question = [
  body("text", "please enter the text correctly").isLength({ min: 5 }),
];
export const answer = [
  body("text", "please enter the text correctly").isLength({ min: 5 }),
];
export const order = [
  body("paymentMethod", "please enter payment method ").not().isEmpty(),
  body("deliverMethod", "please enter deliver method ").not().isEmpty(),
];
export const cart = [body("gameId", "please enter game id ").not().isEmpty()];

/**
 * @description user/ isAuth function
 * @description this function is for checking user authorization
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
export function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  jwt.verify(authHeader, process.env.USER_JWT, (err, decodedToken) => {
    console.log(decodedToken);
    if (err || !decodedToken) {
      console.log(err);
      return res.status(401).send("not authorized");
    }
    res.auth = decodedToken;
    next();
  });
}

import { body, param, validationResult } from 'express-validator'
const jwt = require('jsonwebtoken');


export const register = [
  body('firstName', 'please enter your first name correctly ').not().isEmpty(),
  body('lastName', 'please enter your last name correctly ').not().isEmpty(),
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please length must be at least 5 ').isLength({ min: 5 }),
  body('role','please enter your role').not().isEmpty()
]
export const update = [
  body('firstName', 'please enter your first name correctly ').optional(),
  body('lastName', 'please enter your last name correctly ').optional(),
  body('email', 'please enter email correctly ').isEmail().optional(),
  body('password', 'please length must be at least 5 ').isLength({ min: 5 }).optional(),
  body('role','please enter your role')
]
export const createUser = [
  body("email", "please enter email correctly ").optional(),
  body("password", "please enter password correctly ").optional().isLength({ min: 5 }),
  body("firstName", "please enter firstName correctly ").optional(),
  body("lastName", "please enter lastName correctly ").optional(),
  
];
export const editUser = [
  body("email", "please enter email correctly ").not().isEmpty(),
  body("password", "please enter password correctly ").not().isEmpty().isLength({ min: 5 }),
  body("firstName", "please enter firstName correctly ").not().isEmpty(),
  body("lastName", "please enter lastName correctly ").not().isEmpty(),
];
export const createSeller = [
  body("email", "please enter email correctly ").not().isEmpty(),
  body("password", "please enter password correctly ").not().isEmpty().isLength({ min: 5 }),
  body("phoneNumber", "please enter phoneNumber correctly ").not().isEmpty().isEmpty()
    .isLength({ max: 11 })
    .custom(async (mobileNumber) => {
      if (mobileNumber.slice(0, 2) !== "09") {
        return Promise.reject("please enter your mobile number correctly");
      }
    }),
  body("firstName", "please enter firstName correctly ").not().isEmpty(),
  body("lastName", "please enter lastName correctly ").not().isEmpty(),
  body("personalId", "please enter personalId correctly ").not().isEmpty().isLength({ min: 9 }),
  body("address", "please enter address correctly ").optional().isLength({min:2, max: 30 }),
  body("city", "please enter city correctly ").optional().isLength({ min: 3 }),
  body("province", "please enter province correctly ").optional().isLength({ min: 1 }),
  body("shopName", "please enter shopName correctly ").optional(),
  body("shabaNumber", "please enter shabaNumber correctly ").optional().isLength({
    min: 24,
    max: 26,
  }),
];
export const editSeller = [
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
export const login = [
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please enter password correctly ').isLength({ min: 4 })
]

export const reset = [
  body('email', 'please enter email correctly ').isEmail()
]

export const newPassword = [
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please enter password correctly ').isLength({ min: 5 })
]



export const createGame = [
  body('seller', 'please choose seller').not().isEmpty(),
  body('title', 'please choose title').not().isEmpty(),
  body('price', 'please choose price').not().isEmpty(),
  body('description', 'please choose description').optional(),
  body('discount', 'please choose discount').optional(),
  body('imageId', 'please choose imageId').optional(),
  body('category', 'please choose category').optional()
]
export const editGame = [
  body('seller', 'please choose seller').optional(),
  body('title', 'please choose title').optional(),
  body('price', 'please choose price').optional(),
  body('description', 'please choose description').optional(),
  body('discount', 'please choose discount').optional(),
  body('imageId', 'please choose imageId').optional(),
  body('category', 'please choose category').optional()
]

export const createDiscount = [
  body('code', 'please enter the name of the code').not().isEmpty(),
  body('maxAmount', 'please choose maxAmount').optional(),
  body('expire', 'please choose expire').not().isEmpty(),
  body('percent', 'please choose percent').not().isEmpty(),
  body('quantity', 'please choose quantity').optional(),
  body('reason', 'please choose reason').not().isEmpty(),
  body('active', 'please choose active').optional(),
  
]
export const editDiscount = [
  body('reason', 'please choose reason').optional(),
  body('code', 'please enter the name of the code').optional(),
  body('maxAmount', 'please choose maxAmount').optional(),
  body('expire', 'please choose expire').optional(),
  body('percent', 'please choose percent').optional(),
  body('quantity', 'please choose quantity').optional(),
  body('active', 'please choose active').optional(),
]

export const category = [
  body('image', 'please choose image').optional(),
  body('name', 'please enter the name of the category').not().isEmpty(),

]


/**
 * @description admin/ isAuth function
 * @description this function is for checking admin authorization
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
export function isAuth(req, res, next) {
  try {

    const authHeader = req.get('Authorization');
    jwt.verify(authHeader, process.env.ADMIN_JWT, (err, decodedToken) => {
      console.log(decodedToken)
      if (err || !decodedToken) {
        console.log(err)
        return res.status(401).send('not authorized')
      }
      res.auth=decodedToken
      next()
    })
  } catch (error) {
    console.log(error)
    return res.status(401).send('not authorized')
  }
}






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
  body('firstName', 'please enter your first name correctly '),
  body('lastName', 'please enter your last name correctly '),
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please length must be at least 5 ').isLength({ min: 5 }),
  body('role','please enter your role')
]

export const login = [
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please enter password correctly ').isLength({ min: 5 })
]

export const reset = [
  body('email', 'please enter email correctly ').isEmail()
]

export const newPassword = [
  body('email', 'please enter email correctly ').isEmail(),
  body('password', 'please enter password correctly ').isLength({ min: 5 })
]



export const Game = [
  // body('image', 'please choose image').not().isEmpty()
]

export const category = [
  body('image', 'please choose image').not().isEmpty(),
  body('name', 'please enter the name of the category').not().isEmpty()
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
    console.log(authHeader)
    jwt.verify(authHeader, process.env.ADMIN_JWT, (err, decodedToken) => {
      console.log(decodedToken)
      if (err || !decodedToken) {
        console.log(err)
        return res.status(401).send('not authorized')
      }
      next()
    })
  } catch (error) {
    console.log(error)
    return res.status(401).send('not authorized')
  }
}






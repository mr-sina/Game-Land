import { validationResult } from 'express-validator';



/**
 * @description Validation Result
 * @param {Object} req
 * @returns {Array} A list of error messages
 */
export default (req) => {
  // extract error messages
  const errors = validationResult(req).array().map(item => {
    return item.msg;
  });

  return errors;
};
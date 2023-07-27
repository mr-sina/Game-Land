import VR from "../middlewares/validators/validationResult";
import mongoose from "mongoose";
import User from "../models/user";
import seller from "../models/seller";
import game from "../models/game";
import discount from "../models/discount";

/**
 * @description get users function
 * @description list all users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of users
 */
export async function getUsers(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { sort, skip, limit } = req.body;
  try {
    const users = await User.find({}, { firstName: 1, lastName: 1 })
      .limit(limit)
      .skip(skip)
      .sort(sort);
    return res.json({
      users,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description get sellers function
 * @description list all sellers
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of sellers
 */
export async function getSellers(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { sort, skip, limit } = req.body;
  try {
    const sellers = await seller
      .find({}, { firstName: 1, lastName: 1, shopName: 1 })
      .limit(limit)
      .skip(skip)
      .sort(sort);

    return res.json({
      sellers,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description get games function
 * @description list all games
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of games
 */
export async function getGames(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { sort, skip, limit } = req.body;
  try {
    const games = await game
      .find({}, { title: 1, price: 1, description: 1 })
      .limit(limit)
      .skip(skip)
      .sort(sort);

    return res.json({
      games,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description get users discounts
 * @description list all discounts
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of discounts
 */
export async function getDiscounts(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { sort, skip, limit } = req.body;
  try {
    const discounts = await discount.find().limit(limit).skip(skip).sort(sort);

    return res.json({
      discounts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description get game function
 * @description list single game
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a game
 */
export async function getGame(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { id } = req.params;
  try {
    const singleGame = await game.findById(id);
    if (!singleGame) {
      return res.json({
        message: "game not found",
      });
    }
    return res.json({
      singleGame,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * @description get seller function
 * @description list single seller
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns a seller
 */
export async function getSeller(req, res, next): Promise<void> {
  // check validation result
  const errors = VR(req);
  if (errors.length > 0) {
    return res.status(400).json({ msg: errors[0], success: false });
  }

  const { id } = req.params;
  try {
    const singleSeller = await seller.findById(id, {
      firstName: 1,
      lastName: 1,
      shopName: 1,
      email:1
    });
    if (!singleSeller) {
      return res.json({
        message: "seller not found",
      });
    }
    return res.json({
      singleSeller,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

import VR from "../middlewares/validators/validationResult";
import mongoose from "mongoose";
import User from "../models/user";
import Comment from "../models/comment";
import Game from "../models/game";
import Order from "../models/order";
import Payment from "../models/payment";
// import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { UserInfo } from "os";

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
  
    try {
      const sort = req.body.sort;
      const skip = req.body.skip;
      const users = await User.find({}, { firstName: 1, lastName: 1 })
        .skip(skip)
        .sort(sort);
  
      return res.json({
        message: "Auth successful",
        users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  /**
 * @description get users function
 * @description list all users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of users
 */
export async function getSellers(req, res, next): Promise<void> {
    // check validation result
    const errors = VR(req);
    if (errors.length > 0) {
      return res.status(400).json({ msg: errors[0], success: false });
    }
  
    try {
      const sort = req.body.sort;
      const skip = req.body.skip;
      const users = await User.find({}, { firstName: 1, lastName: 1 })
        .skip(skip)
        .sort(sort);
  
      return res.json({
        message: "Auth successful",
        users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  

    /**
 * @description get users function
 * @description list all users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of users
 */
export async function getGames(req, res, next): Promise<void> {
    // check validation result
    const errors = VR(req);
    if (errors.length > 0) {
      return res.status(400).json({ msg: errors[0], success: false });
    }
  
    try {
      const sort = req.body.sort;
      const skip = req.body.skip;
      const users = await User.find({}, { firstName: 1, lastName: 1 })
        .skip(skip)
        .sort(sort);
  
      return res.json({
        message: "Auth successful",
        users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
    /**
 * @description get users function
 * @description list all users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise} returns array of users
 */
export async function getDiscounts(req, res, next): Promise<void> {
    // check validation result
    const errors = VR(req);
    if (errors.length > 0) {
      return res.status(400).json({ msg: errors[0], success: false });
    }
  
    try {
      const sort = req.body.sort;
      const skip = req.body.skip;
      const users = await User.find({}, { firstName: 1, lastName: 1 })
        .skip(skip)
        .sort(sort);
  
      return res.json({
        message: "Auth successful",
        users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
import { NextFunction, Response } from "express";
import { createToken } from "../../middleware/auth";
import { AuthRequest } from "../../middleware/auth/auth.types";
import UserService from "./User.service";

export default class AuthController {
  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Don't show password
    console.log("login - authcontroller")
    const { user } = req;
    const userService =  new UserService();
    const userData = await userService.findOne(user.id);

    return res.json({
      user: userData,
      token: createToken(userData),
    });
  };
}
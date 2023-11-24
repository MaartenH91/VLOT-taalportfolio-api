import * as passport from "passport";
import AuthError from "../../errors/AuthError";
import LocalStrategy from "./LocalStrategy";
import ForbiddenError from "../../errors/ForbiddenError";
import * as jwt from "jsonwebtoken";
import JwtStrategy from "./JwtStrategy";
import { NextFunction, Response } from "express";
import User from "../../modules/User/User.entity";
import { UserRole } from "../../modules/User/User.constants";

// passport.use("local", LocalStrategy);
passport.use("jwt", JwtStrategy);

// This is a wrapper for passport.authenticate that handles errors
const passportWithErrorHandling = (strategy: any) => {
  return function (req, res: Response, next: NextFunction) {
    passport.authenticate(
      strategy,
      { session: false },
      function (err: any, user: User) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new AuthError());
        } else {
          req.user = user;
          return next();
        }
      }
    )(req, res, next);
  };
};

const authLocal = passportWithErrorHandling("local");
const authJwt = passportWithErrorHandling("jwt");

// Creates a JWT token for the user that will expire in the number of hours specified in the .env file
// The token wil keep track of the user
const createToken = (user: User) => {
  console.log("create jwt")
  return jwt.sign({ id: user.id, user: user.email }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN_HOURS) * 60 * 60,
  });
};

// Middleware that checks if the user has the required role
const withRole = (roles: UserRole) => (req, res, next) => {
  const { user } = req;

  if (roles.includes(user.rol)) {
    next();
  } else {
    next(new ForbiddenError());
  }
};

export { authLocal, authJwt, withRole, createToken };

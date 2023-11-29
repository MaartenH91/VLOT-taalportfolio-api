import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { QueryFailedError, TypeORMError } from "typeorm";
import BaseError from "../errors/BaseError";
import { Application, NextFunction, Request, Response, Router } from "express";

const registerMiddleware = (app: Router) => {
  // use CORS middleware
  // add "allow all" cors
  if (process.env.ENV === "PRODUCTION" || process.env.ENV === "production") {
    const corsOptions = {
      origin: '*',
      // methods: '*',
      methods: 'GET,POST,DELETE,UPDATE,PUT,PATCH,OPTIONS',
      allowedHeaders: 'Access-Control-Request-Headers,Access-Control-Request-Method',
      optionsSuccessStatus: 200,
      credentials: true,
    };
    // allows CORS online
    app.use(cors(corsOptions));
  } else {
    app.use(cors());
  }
  // JSON is going to be the default format
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // blocks the browser from trying to guess the MIME type
  app.use(helmet.noSniff());
  // Hides the X-Powered-By header
  app.use(helmet.hidePoweredBy());
  // Adds a filter to prevent XSS attacks
  app.use(helmet.xssFilter());
};

// Error handler
const registerErrorHandler = (app: Application) => {
  // Default error handler
  app.use(function (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let message: string;
    let statusCode: number;
    let errors = {};

    if (err instanceof QueryFailedError) {
      message = err.driverError.detail;
      statusCode = 400;
    } else if (err instanceof TypeORMError) {
      message = err.message;
      statusCode = 500;
    } else if (err instanceof BaseError) {
      message = err.message;
      statusCode = err.statusCode;
      errors = err.errors;
    } else {
      message = String(err);
      statusCode = 500;
    }
    res.status(statusCode).json({
      message,
      statusCode,
      errors,
    });
  });
};

export { registerMiddleware, registerErrorHandler };

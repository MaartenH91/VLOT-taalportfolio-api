import BaseError from "./BaseError";

export default class AuthError extends BaseError {
  constructor() {
    super("Unauthorized", 401);
  }
}
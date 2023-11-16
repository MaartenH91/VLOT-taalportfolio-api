import BaseError from "./BaseError";

export default class ForbiddenError extends BaseError {
  constructor() {
    super("Forbidden", 403);
  }
}
import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  constructor() {
    super("Resource not found", 404);
  }
}
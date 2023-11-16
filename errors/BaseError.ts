export default class BaseError extends Error {
  public errors: {};
  public message: string;
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
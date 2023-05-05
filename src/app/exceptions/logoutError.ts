export class LogoutError extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "LogoutError";

      Object.setPrototypeOf(this, LogoutError.prototype);
    }
  }
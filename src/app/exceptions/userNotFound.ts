export class UserNotFound extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "UserNotFound";

      Object.setPrototypeOf(this, UserNotFound.prototype);
    }
  }
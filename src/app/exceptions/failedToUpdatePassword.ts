export class FailedToUpdatePassword extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "FailedToUpdatePassword";

      Object.setPrototypeOf(this, FailedToUpdatePassword.prototype);
    }
  }
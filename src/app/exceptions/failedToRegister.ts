export class FailedToRegister extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "FailedToRegister";

      Object.setPrototypeOf(this, FailedToRegister.prototype);
    }
  }
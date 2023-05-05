export class InvalidPassword extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "InvalidPassword";

      Object.setPrototypeOf(this, InvalidPassword.prototype);
    }
  }
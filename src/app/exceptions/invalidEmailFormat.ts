export class InvalidEmailFormat extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "InvalidEmailFormat";

      Object.setPrototypeOf(this, InvalidEmailFormat.prototype);
    }
  }
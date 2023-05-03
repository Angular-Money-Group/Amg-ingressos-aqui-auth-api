export class EmailAlreadyExists extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "EmailAlreadyExists";

      Object.setPrototypeOf(this, EmailAlreadyExists.prototype);
    }
  }
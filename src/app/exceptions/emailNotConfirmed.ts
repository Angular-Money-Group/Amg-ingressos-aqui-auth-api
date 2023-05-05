export class EmailNotConfirmed extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "EmailNotConfirmed";

      Object.setPrototypeOf(this, EmailNotConfirmed.prototype);
    }
  }
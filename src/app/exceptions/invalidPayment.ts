export class InvalidPayment extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "InvalidPayment";

      Object.setPrototypeOf(this, InvalidPayment.prototype);
    }
  }
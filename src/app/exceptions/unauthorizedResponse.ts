export class UnauthorizedResponse extends Error {
    statusCode = 401;

    constructor(message: string) {
      super(message);
      this.name = "UnauthorizedResponse";

      Object.setPrototypeOf(this, UnauthorizedResponse.prototype);
    }
  }
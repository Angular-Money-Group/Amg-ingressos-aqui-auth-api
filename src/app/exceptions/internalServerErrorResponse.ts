export class InternalServerErrorResponse extends Error {
    statusCode = 422;

    constructor(message: string) {
      super(message);
      this.name = "InternalServerErrorResponse";

      Object.setPrototypeOf(this, InternalServerErrorResponse.prototype);
    }
  }
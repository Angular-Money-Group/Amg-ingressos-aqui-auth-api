export class UnprocessableEntityResponse extends Error {
    statusCode = 422;

    constructor(message: string) {
      super(message);
      this.name = "UnprocessableEntityResponse";

      Object.setPrototypeOf(this, UnprocessableEntityResponse.prototype);
    }
  }
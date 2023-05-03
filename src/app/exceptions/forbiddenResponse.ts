export class ForbiddenResponse extends Error {
    statusCode = 403;

    constructor(message: string) {
      super(message);
      this.name = "ForbiddenResponse";

      Object.setPrototypeOf(this, ForbiddenResponse.prototype);
    }
  }
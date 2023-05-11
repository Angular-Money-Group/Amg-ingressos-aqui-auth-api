export class ModelNotFound extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "ModelNotFound";

      Object.setPrototypeOf(this, ModelNotFound.prototype);
    }
  }
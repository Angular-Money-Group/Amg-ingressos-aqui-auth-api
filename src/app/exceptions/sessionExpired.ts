export class SessionExpired extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "SessionExpired";

      Object.setPrototypeOf(this, SessionExpired.prototype);
    }
  }
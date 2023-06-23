export class EventNotFound extends Error {
    statusCode = 404;

    constructor(message: string) {
      super(message);
      this.name = "EventNotFound";

      Object.setPrototypeOf(this, EventNotFound.prototype);
    }
  }
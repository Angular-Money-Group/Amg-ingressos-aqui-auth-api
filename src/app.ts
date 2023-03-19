import express from "express";
import dotenv from "dotenv";

import swaggerUI from "swagger-ui-express";

dotenv.config();

export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.swagger();
    this.middleware();
    this.router();
    this.connectDB();
  }

  private middleware() {
    this.server.use(express.json());
  }

  private connectDB() {
    // Connect to database
  }

  private router() {
  }

  private swagger() {
  }
}

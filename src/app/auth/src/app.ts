import express from "express";
import dotenv from "dotenv";

import { connection } from "./app/db/database";

import swaggerUI from "swagger-ui-express";

import authRouter from "./app/routes/auth.router";
import cors from 'cors';
dotenv.config();

export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.swagger();
    this.middleware();
    this.router();
    this.connectDB();
    this.server.use(cors())
  }

  private middleware() {
    this.server.use(express.json());
  }

  private connectDB() {
    // Connect to database
    connection()
  }

  private router() {
    this.server.use(authRouter)
  }

  private swagger() {
    // this.server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs))
  }
}

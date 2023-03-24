import { Logger } from './app/services/logger.service';
import express from "express";
import dotenv from "dotenv";

import { connection } from "./app/db/database";

import swaggerUI from "swagger-ui-express";

import authRouter from "./app/routes/auth.router";
import cors from 'cors';
import eventRouter from "./app/routes/events.router";
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
    Logger.infoLog("Loading middleware");
    const corsOptions = {
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    this.server.use(express.json());
    this.server.use(cors(corsOptions))

  }

  private connectDB() {
    // Connect to database
    Logger.infoLog("Connecting to database");
    connection()
  }

  private router() {
    Logger.infoLog("Loading routes");
    this.server.use(authRouter)
    this.server.use(eventRouter)
  }

  private swagger() {
    // this.server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs))
  }
}

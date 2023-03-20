import express from "express";
import dotenv from "dotenv";

import { connection } from "./app/db/database";
import eventRouter from "./app/routes/events.router";
import swaggerUI from "swagger-ui-express";

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
  }
  
  private middleware() {
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
    connection()
  }

  private router() {
    this.server.use(eventRouter)
  }

  private swagger() {
    // this.server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs))
  }
}

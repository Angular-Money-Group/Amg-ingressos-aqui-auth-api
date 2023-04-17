import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import eventRouter from "./app/routes/events.router";
import { Logger } from './app/services/logger.service';
import { connection } from "./app/db/database";
import { AuthRouter } from "./app/routes/auth.router";
import swaggerDocs from "./swagger";

dotenv.config();

export class App {
  public server: any

  constructor(private authRouter: AuthRouter) {
    this.server = express();

    swaggerDocs(this.server, 3001);

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
    this.server.use(this.authRouter.authRouter)
    this.server.use(eventRouter)
  }

  private swagger() {
    // this.server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs))
  }
}

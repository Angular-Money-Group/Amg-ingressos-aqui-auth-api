import { unauthorizedResponse, forbiddenResponse } from "./responses.utils";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Logger } from "../services/logger.service";

export class TokenValidation {

  constructor(){}

  authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    Logger.infoLog("Auth Header: " + authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      Logger.errorLog("Token not found");
      return unauthorizedResponse(res);
    }
    Logger.infoLog("Token: " + token);
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (err) {
          Logger.errorLog("Error verifying token: " + err);
          return forbiddenResponse(res);
        }

        req.body.user = payload;
        next();
      }
    );
  };

  verifyProducerPermission(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(
      token!,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (err) {
          Logger.errorLog("Error verifying token: " + err);
          return forbiddenResponse(res);
        }

        if (payload.userType != "Producer" && payload.userType != "Admin") {
          Logger.errorLog("User is not Producer");
          return forbiddenResponse(res);
        }
        req.body.user = payload;
        Logger.infoLog("User: " + req.body.user);
        next();
      }
    );
  }

  verifyAdminPermission(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(
      token!,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (err) {
          Logger.errorLog("Error verifying token: " + err);
          return forbiddenResponse(res);
        }

        if (payload.userType != "Admin") {
          Logger.errorLog("User is not Admin");
          return forbiddenResponse(res);
        }
        req.body.user = payload;
        Logger.infoLog("User: " + req.body.user);
        next();
      }
    );
  }
}

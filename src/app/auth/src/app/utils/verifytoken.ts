import { unauthorizedResponse, forbiddenResponse } from './responses.utils';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {Logger} from "../services/logger.service";


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    Logger.infoLog("Auth Header: " + authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      Logger.errorLog("Token not found");
      return unauthorizedResponse(res)
    }
    Logger.infoLog("Token: " + token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, payload: any) => {
      if (err) {
        Logger.errorLog("Error verifying token: " + err);
        return forbiddenResponse(res)
      }
      req.body.userId = payload.user.id;
      Logger.infoLog("User Id: " + req.body.userId);
      next();
    });
  };

export const verifyTokenPermission = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!, (err: any, payload: any) => {
      if (err) {
        Logger.errorLog("Error verifying token: " + err);
        return forbiddenResponse(res)
      }

      if (!payload.user.manager) {
        Logger.errorLog("User is not admin");
        return forbiddenResponse(res)
      }

      Logger.infoLog("User Id: " + req.body.userId);
      next();
    });
  }

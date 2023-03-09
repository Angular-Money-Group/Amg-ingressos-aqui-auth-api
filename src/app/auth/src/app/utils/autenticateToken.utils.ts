import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

  export const generateTokens = (payload: any) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  };

export default { generateTokens };
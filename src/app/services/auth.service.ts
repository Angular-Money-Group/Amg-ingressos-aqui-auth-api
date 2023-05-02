import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OperationsDB } from "../db/operations.db";
import CustomerModel from "../models/customer.model";
import ProducerModel from "../models/producer.models";
import customerModel, { CustomerType } from "./../models/customer.model";
import { ProducerType } from "./../models/producer.models";
import { Logger } from "./logger.service";
import { Model } from "mongoose";

dotenv.config();

export class AuthService {
  private static accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
  private static refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

  public static async findUserByEmail<M extends Model<any>>(
    value: string,
    model: M
  ): Promise<any> {
    Logger.infoLog(`Find ${model.modelName} by email`);
    const user: any = await OperationsDB.findByEmail(value, model)
      .then((result: any) => {
        Logger.infoLog(`Find ${model.modelName} by email result: ` + result);
        return Promise.resolve(result);
      })
      .catch((error) => {
        Logger.errorLog(`Find ${model.modelName} by email error: ` + error);
        return Promise.reject(error);
      });

    return Promise.resolve(user);
  }

  public static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt
      .compare(password, hash)
      .then((result) => {
        Logger.infoLog("Compare password result: " + result);
        return Promise.resolve(result);
      })
      .catch((error) => {
        Logger.errorLog("Compare password error: " + error);
        return Promise.reject(error);
      });
  }

  public static async generateTokens(user: any) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    Logger.infoLog("Tokens" + { accessToken, refreshToken });
    return { accessToken, refreshToken };
  }

  public static verifyAccessToken(token: string): string | object {
    Logger.infoLog("Verify Access token");
    return jwt.verify(token, this.accessTokenSecret);
  }

  public static verifyRefreshToken(token: string): string | object {
    Logger.infoLog("Verify refresh token");
    return jwt.verify(token, this.refreshTokenSecret);
  }

  public static async generateAccessToken(user: any) {
    Logger.infoLog("Generate access token");
    const accessToken = await jwt.sign(user, this.accessTokenSecret, {
      expiresIn: "2h",
    });
    return accessToken;
  }

  public static async generateRefreshToken(user: CustomerType | ProducerType) {
    Logger.infoLog("Generate refresh token");
    const refreshToken = await jwt.sign({ user }, this.refreshTokenSecret, {
      expiresIn: "7d",
    });
    return refreshToken;
  }

  public static decodeToken(token: string): any {
    Logger.infoLog("Decode token");
    return jwt.decode(token);
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(16);
    return await bcrypt
      .hash(password, salt)
      .then((result) => {
        Logger.infoLog("Hash password result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Hash password error: " + error);
        return error;
      });
  }

  public static async createCustomer(customer: CustomerType): Promise<any> {
    return await OperationsDB.registerItem(customer, CustomerModel)
      .then((result) => {
        Logger.infoLog("Create customer result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Create customer error: " + error);
        return error;
      });
  }

  public static async createProducer(producer: any): Promise<any> {
    return await OperationsDB.registerItem(producer, ProducerModel)
      .then((result) => {
        Logger.infoLog("Create producer result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Create producer error: " + error);
        return error;
      });
  }

  public static async changePassword(
    id: string,
    newPassword: string,
    userType: string
  ) {
    if (userType === "Customer") {
      await OperationsDB.updateItems(id, {password: newPassword}, customerModel).then(
        (update: any) => {
          return Promise.resolve(update);
        }
      );
    } else if (userType == "Producer") {
      await OperationsDB.updateItems(id, {password: newPassword}, ProducerModel).then(
        (update: any) => {
          return Promise.resolve(update);
        }
      );
    } else {
      return Promise.reject();
    }
  }
}

export default { AuthService };

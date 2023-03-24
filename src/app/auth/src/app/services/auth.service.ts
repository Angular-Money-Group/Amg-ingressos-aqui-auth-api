import { ProducerType } from "./../models/producer.models";
import { Document, Model } from "mongoose";
import { CustomerType } from "./../models/customer.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Logger } from "./logger.service";
import ProducerModel  from "../models/producer.models";
import CustomerModel from "../models/customer.model";

dotenv.config();

export class AuthService {

  constructor(
  ) {}

  public static async findCustomerByEmail(value: string): Promise<any> {
    Logger.infoLog("Find customer by email");
    return CustomerModel
      .findOne({ email: value })
      .exec()
      .then((result) => {
        Logger.infoLog("Find customer by email result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find customer by email error: " + error);
        return error;
      });
  }

  public static async findProducerByEmail(value: string): Promise<any> {
    return ProducerModel
      .findOne({ email: value })
      .exec()
      .then((result) => {
        Logger.infoLog("Find producer by email result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find producer by email error: " + error);
        return error;
      });
  }

  public static comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt
      .compare(password, hash)
      .then((result) => {
        Logger.infoLog("Compare password result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Compare password error: " + error);
        return error;
      });
  }

  public static generateTokens(user: CustomerType | ProducerType): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  public static verifyAccessToken(token: string): any {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  }

  public static verifyRefreshToken(token: string): any {
    Logger.infoLog("Verify refresh token");
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  }

  public static generateAccessToken(user: CustomerType | ProducerType): string {
    Logger.infoLog("Generate access token");
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });
  }

  public static generateRefreshToken(user: CustomerType | ProducerType): string {
    Logger.infoLog("Generate refresh token");
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
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

  public static async createCustomer(
    customer: CustomerType
  ): Promise<Document> {
    const newCustomer = new CustomerModel(customer);
    return await newCustomer
      .save()
      .then((result) => {
        Logger.infoLog("Create customer result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Create customer error: " + error);
        return error;
      });
  }

  public static async createProducer(
    producer: ProducerType
  ): Promise<Document> {
    const newProducer = await new ProducerModel(producer);
    return await newProducer
      .save()
      .then((result) => {
        Logger.infoLog("Create producer result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Create producer error: " + error);
        return error;
      });
  }
}

export default { AuthService };

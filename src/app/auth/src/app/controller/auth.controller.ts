import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Logger } from "../services/logger.service";
import { internalServerErrorResponse } from "../utils/responses.utils";
import { CustomerType } from "./../models/customer.model";
import { ProducerType } from "./../models/producer.models";
import {
  badRequestResponse,
  successResponse,
  unprocessableEntityResponse,
} from "./../utils/responses.utils";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return unprocessableEntityResponse(res);
    }

    const user: CustomerType | ProducerType =
      (await AuthService.findCustomerByEmail(email)) ||
      (await AuthService.findProducerByEmail(email));
    if (!user) {
      Logger.errorLog("User not found");
      return badRequestResponse(res);
    } else {
      const isMatch = await AuthService.comparePassword(
        password,
        user.password as string
      );
      Logger.infoLog("Compare password result: " + isMatch);

      if (!isMatch) {
        Logger.errorLog("Password not match");
        return badRequestResponse(res);
      }

      Logger.infoLog("Delete User password for generate tokens");
      delete user.password;

      Logger.infoLog("Generate tokens");
      const { accessToken, refreshToken } = AuthService.generateTokens(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });
      Logger.infoLog("Send token to cookies");

      return successResponse(res, { accessToken });
    }
  } catch (error: any) {
    Logger.errorLog("Login error: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export const registerProducer = async (req: Request, res: Response) => {
  const { manager, cnpj, email, password, name, phoneNumber, corporateName } =
    req.body;

  if (
    !manager ||
    !cnpj ||
    !email ||
    !password ||
    !name ||
    !phoneNumber ||
    !corporateName
  ) {
    Logger.errorLog("Missing params");
    return unprocessableEntityResponse(res);
  }

  const producer = await AuthService.findProducerByEmail(email);

  if (producer) {
    Logger.errorLog("Producer already exists");
    return badRequestResponse(res);
  }

  const hashPassword = await AuthService.hashPassword(password);
  Logger.infoLog("Gen Passhash" + hashPassword);

  const newProducer: any = await AuthService.createProducer({
    manager,
    cnpj,
    email,
    password: hashPassword,
    phoneNumber,
    corporateName,
    isPhoneVerified: false,
    isEmailVerified: false,
  });

  if (!newProducer) {
    Logger.errorLog("Producer not created");
    return internalServerErrorResponse(res, "Producer not created");
  }
  Logger.infoLog("Producer created");

  delete newProducer.password;
  Logger.infoLog("Delete password from producer");

  const { accessToken, refreshToken } = AuthService.generateTokens(newProducer);
  Logger.infoLog("Generate tokens");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
  });
  Logger.infoLog("Send token to cookies");

  return successResponse(res, { accessToken, producer: newProducer });
};

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { name, cpf, email, password, phoneNumber } = req.body;

    if (!name || !cpf || !email || !password || !phoneNumber) {
      Logger.errorLog("Missing params");
      return unprocessableEntityResponse(res);
    }

    const customer = await AuthService.findCustomerByEmail(email);

    if (customer) {
      Logger.errorLog("Customer already exists");
      return badRequestResponse(res);
    }

    const hashPassword = await AuthService.hashPassword(password);
    Logger.infoLog("Gen Passhash" + hashPassword);

    const newCustomer: any = await AuthService.createCustomer({
      name,
      cpf,
      email,
      password: hashPassword,
      phoneNumber,
      isPhoneVerified: false,
      isEmailVerified: false,
    });

    if (!newCustomer) {
      Logger.errorLog("Customer not created");
      return internalServerErrorResponse(res, "Customer not created");
    }

    Logger.infoLog("Customer created");

    delete newCustomer.password;
    Logger.infoLog("Delete password from customer");

    const { accessToken, refreshToken } =
      AuthService.generateTokens(newCustomer);
    Logger.infoLog("Generate tokens");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
    });
    Logger.infoLog("Send token to cookies");

    return successResponse(res, { accessToken, customer: newCustomer });
  } catch (error: any) {
    Logger.errorLog("Register customer error: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    Logger.infoLog("Clear cookie");
    return successResponse(res, {});
  } catch (error: any) {
    Logger.errorLog("Logout error: " + error.message);
    return internalServerErrorResponse(res, error.message);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      Logger.errorLog("Refresh token not found");
      return unprocessableEntityResponse(res);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      AuthService.generateTokens(refreshToken);
    Logger.infoLog("Generate tokens");

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
    });
    Logger.infoLog("Send token to cookies");

    return successResponse(res, { accessToken });
  } catch (error: any) {
    Logger.errorLog("Refresh token error: " + error.message);
    return internalServerErrorResponse(res, error.message);
  }
};

export default {
  login,
  refreshToken,
  logout,
  registerProducer,
  registerCustomer,
};

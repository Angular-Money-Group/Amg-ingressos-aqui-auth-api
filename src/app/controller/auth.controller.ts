import EmailService from "./../services/emails.service";
import { Request, Response } from "express";
import authService, { AuthService } from "../services/auth.service";
import { Logger } from "../services/logger.service";
import { internalServerErrorResponse } from "../utils/responses.utils";
import customerModel from "./../models/customer.model";
import producerModels from "./../models/producer.models";
import {
  badRequestResponse,
  successResponse,
  unprocessableEntityResponse,
} from "./../utils/responses.utils";

export class AuthController {
  constructor() {}

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return unprocessableEntityResponse(res);
      }

      const user: any = Promise.all([
        AuthService.findUserByEmail(email, customerModel),
        AuthService.findUserByEmail(email, producerModels),
      ]);

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
        const { accessToken, refreshToken } = await AuthService.generateTokens(
          user
        );

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
  }

  public async registerProducer(req: Request, res: Response) {
    try {
      const { manager, cnpj, email, password, phoneNumber, corporateName } =
        req.body;

      if (
        !manager ||
        !cnpj ||
        !email ||
        !password ||
        !phoneNumber ||
        !corporateName
      ) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      }

      const producer = await AuthService.findUserByEmail(email, producerModels);

      if (producer) {
        Logger.errorLog("Producer already exists");
        return badRequestResponse(res);
      }

      const hashPassword = await AuthService.hashPassword(password);
      Logger.infoLog("Gen Passhash " + hashPassword);

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
      const emailService = new EmailService();

      Logger.log(newProducer);
      emailService.sendEmailToConfirmationAccount(
        {
          id: newProducer._id,
          email: newProducer.email,
        },
        producerModels
      );

      delete newProducer.password;
      Logger.infoLog("Delete password from producer");

      return successResponse(res, { producer: newProducer });
    } catch (err: any) {
      Logger.errorLog("Login error: " + err.message);
      internalServerErrorResponse(res, err.message);
    }
  }

  public async registerCustomer(req: Request, res: Response) {
    try {
      const { name, cpf, email, password, phoneNumber } = req.body;

      if (!name || !cpf || !email || !password || !phoneNumber) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      }

      const customer = await AuthService.findUserByEmail(email, customerModel);

      const isProducer = await AuthService.findUserByEmail(
        email,
        producerModels
      );

      if (customer || isProducer) {
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
      const emailService = new EmailService();

      emailService.sendEmailToConfirmationAccount(
        {
          id: newCustomer._id,
          email: newCustomer.email,
        },
        customerModel
      );

      delete newCustomer.password;
      Logger.infoLog("Delete password from customer");

      return successResponse(res, { customer: newCustomer });
    } catch (error: any) {
      Logger.errorLog("Register customer error: " + error);
      return internalServerErrorResponse(res, error.message);
    }
  }

  public async logout(req: Request, res: Response) {
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
  }

  public async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        Logger.errorLog("Refresh token not found");
        return unprocessableEntityResponse(res);
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.generateTokens(refreshToken);
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
  }

  public async resendEmail(req: Request, res: Response) {
    Logger.infoLog("Finding User");

    let user = await AuthService.findUserByEmail(req.body.email, customerModel)

    if(!user) user = await AuthService.findUserByEmail(req.body.email, producerModels)

    if (!user) {
      Logger.errorLog("User not found");
      return badRequestResponse(res);
    } else {
      Logger.infoLog("Reenviando email");
      const emailService = new EmailService();

      emailService.sendEmailToConfirmationAccount(
        {
          id: user._id,
          email: user.email,
        },
        producerModels
      );

      return successResponse(res, null);
    }
  }

  public async confirmationEmail(req: Request, res: Response) {
    try {
      const userID = req.params.id;
      const { codeConfirmation, userType } = req.body;

      if (!codeConfirmation || !userID) {
        Logger.errorLog("No Informations");
        return unprocessableEntityResponse(res);
      }

      const emailService = new EmailService();

      if (userType === "Customer") {
        Logger.infoLog("Validating Customer Email");
        await emailService
          .confirmationEmail(userID, codeConfirmation, customerModel)
          .then(() => {
            successResponse(res, null);
          })
          .catch((err: any) => {
            badRequestResponse(res);
          });
      }

      if (userType === "Producer") {
        Logger.infoLog("Validating Producer Email");
        await emailService
          .confirmationEmail(userID, codeConfirmation, producerModels)
          .then(() => {
            successResponse(res, null);
          })
          .catch((err: any) => {
            badRequestResponse(res);
          });
      }
    } catch (err: any) {
      internalServerErrorResponse(res, err);
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const emailService = new EmailService();
    await emailService.sendEmailForForgotPassword(email);

    return successResponse(res, null);
  }

  public async resetPassword(req: Request, res: Response) {
    const id = req.params.id;
    const { newPassword, userType } = req.body;

    const hashPassword = await AuthService.hashPassword(newPassword);
    Logger.infoLog("Gen Passhash " + hashPassword);

    await AuthService.changePassword(id, hashPassword, userType)
      .then(() => {
        successResponse(res, null);
      })
      .catch((err) => {
        internalServerErrorResponse(res, err);
      });
  }
}

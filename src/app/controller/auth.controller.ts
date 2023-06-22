import EmailService from "./../services/emails.service";
import { Request, Response } from "express";
import authService, { AuthService } from "../services/auth.service";
import { Logger } from "../services/logger.service";
import { createdResponse, internalServerErrorResponse, sessionExpired } from "../utils/responses.utils";
import customerModel from "./../models/customer.model";
import producerModels from "./../models/producer.models";
import * as Exception from "../exceptions";
import {
  badRequestResponse,
  successResponse,
  unprocessableEntityResponse,
  userNotFound,
  invalidPassword,
  emailAlreadyExists,
  failToRegister,
  invalidEmailFormat,
  logoutError,
  emailNotConfirmed,
  failedToUpdatePassword,
} from "./../utils/responses.utils";

export class AuthController {
  constructor() {}

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }

      let user: any;
      let userType: any;

      user = await Promise.all([
        AuthService.findUserByEmail(email, customerModel),
        AuthService.findUserByEmail(email, producerModels),
      ]);

      user = user.find((userOb: any) => {
        return userOb;
      })

      if (!user) {
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      if ("cpf" in user) {
        userType = "Customer";
      } else if(user.email === process.env.EMAIL_ADMIN || user.email === process.env.EMAIL_ADMIN2){
        userType = "Admin";
      } else if ("cnpj" in user) {
        userType = "Producer";
      } else {
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      const isMatch = await AuthService.comparePassword(
        password,
        user.password as string
      );
      Logger.infoLog("Compare password result: " + isMatch);

      if (!isMatch) {
        throw new Exception.InvalidPassword("Senha nao confere");
      }

      Logger.infoLog("Delete User password for generate tokens");

      delete user.password;

      if (user.password) user.password = undefined;
      Logger.infoLog(user);

      Logger.infoLog("Generate tokens");

      const { accessToken, refreshToken } = await AuthService.generateTokens({
        user,
        userType,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });
      Logger.infoLog("Send token to cookies");

      return successResponse(res, { accessToken });

    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      }
      else if (error instanceof Exception.UserNotFound) {
        Logger.errorLog("User not found");
        return userNotFound(res);
      }
      else if (error instanceof Exception.InvalidPassword) {
        Logger.errorLog("Password not match");
        return invalidPassword(res);
      }
      else {
        Logger.errorLog(
          "error_code: " + error.error_code + "Login error: " + error
        );
        console.error(error);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async registerColab(req: Request, res: Response) {
    try {
      const { name, cpf, email, password, producerId } =
        req.body;

        if(!name|| !cpf|| !email|| !password|| !producerId) return unprocessableEntityResponse(res)

        const hashPassword = await AuthService.hashPassword(password);
        Logger.infoLog("Gen Passhash " + hashPassword);
  
        const resultData = await AuthService.registerColab({name, cpf, email, password: hashPassword}, producerId)

        return createdResponse(res, resultData, 'Colaborador')
      } catch(err: any) {
        return internalServerErrorResponse(res, err.message);
      }
  }

  public async registerProducer(req: Request, res: Response) {
    try {
      const { name, cnpj, email, password, phoneNumber, corporateName } =
        req.body;

      if (
        !name ||
        !cnpj ||
        !email ||
        !password ||
        !phoneNumber ||
        !corporateName
      ) {
        throw new Exception.UnauthorizedResponse("Campos Nulos");
      }

      if (
        !/^[A-Za-z0-9+_.-]+[@]{1}[A-Za-z0-9-]+[.]{1}[A-Za-z.]+$/.test(email)
      ) {
        throw new Exception.InvalidEmailFormat("Formato de email invalido")
      }

      const producer = await AuthService.findUserByEmail(email, producerModels);

      const isCustomer = await AuthService.findUserByEmail(
        email,
        producerModels
      );

      if (isCustomer || producer) {
        throw new Exception.EmailAlreadyExists("Email jah existe");
      }

      const hashPassword = await AuthService.hashPassword(password);
      Logger.infoLog("Gen Passhash " + hashPassword);

      const newProducer: any = await AuthService.createProducer({
        name,
        cnpj,
        email,
        password: hashPassword,
        phoneNumber,
        corporateName,
        isPhoneVerified: false,
        isEmailVerified: false,
      });

      if (!newProducer) {
        throw new Exception.FailedToRegister("Produtor nao cadastrado");
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
      if (newProducer.password) newProducer.password = undefined;
      Logger.infoLog("Delete password from producer");

      const userToken = await AuthService.generateAccessToken({ newProducer });

      return successResponse(res, { producer: newProducer, userToken });
    } catch (error: any) {
        if (error instanceof Exception.UnprocessableEntityResponse) {
          Logger.errorLog("Missing params");
          return unprocessableEntityResponse(res);
        }
        else if (error instanceof Exception.InvalidEmailFormat) {
          Logger.errorLog("Invalid email format");
          return invalidEmailFormat(res);
        }
        else if (error instanceof Exception.EmailAlreadyExists) {
          Logger.errorLog("User email already exists");
          return emailAlreadyExists(res);
        }
        else if(error instanceof Exception.FailedToRegister) {
          Logger.errorLog("Producer not created");
          return failToRegister(res);
        }
        else {
          Logger.errorLog("Register Producer error: " + error.message);
          internalServerErrorResponse(res, error.message);
        }
    }
  }

  public async registerCustomer(req: Request, res: Response) {
    try {
      const { name, cpf, email, password, phoneNumber } = req.body;

      if (!name || !cpf || !email || !password || !phoneNumber) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }

      if (
        !/^[A-Za-z0-9+_.-]+[@]{1}[A-Za-z0-9-]+[.]{1}[A-Za-z.]+$/.test(email)
      ) {
        throw new Exception.InvalidEmailFormat("Formato de email invalido")
      }

      const customer = await AuthService.findUserByEmail(email, customerModel);

      const isProducer = await AuthService.findUserByEmail(
        email,
        producerModels
      );

      if (customer || isProducer) {
        throw new Exception.EmailAlreadyExists("Email jah existe");
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
        throw new Exception.FailedToRegister("Customer nao cadastrado");
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

      if (newCustomer.password) newCustomer.password = undefined;
      Logger.infoLog("Delete password from customer");

      Logger.infoLog(newCustomer);

      const userToken = await AuthService.generateAccessToken({ newCustomer });

      return successResponse(res, { customer: newCustomer, userToken });
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      }
      else if (error instanceof Exception.InvalidEmailFormat) {
        Logger.errorLog("Invalid email format");
        return invalidEmailFormat(res);
      }
      else if (error instanceof Exception.EmailAlreadyExists) {
        Logger.errorLog("User email already exists");
        return emailAlreadyExists(res);
      }
      else if(error instanceof Exception.FailedToRegister) {
        Logger.errorLog("Customer not created");
        return failToRegister(res);
      }
      else {
        Logger.errorLog("Register Costumer error: " + error.message);
        internalServerErrorResponse(res, error.message);
      }
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
    } 
    
    catch (error: any) {
      Logger.errorLog("Logout error: " + error.message);
      return logoutError(res);
    }
  }

  public async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new Exception.SessionExpired("refresh token nao encontrado");
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
    }
    catch (error: any) {
      if (error instanceof Exception.SessionExpired){
        Logger.errorLog("Refresh token not found");
        return sessionExpired(res);
      } else {
        Logger.errorLog("Refresh token error: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async resendEmail(req: Request, res: Response) {
    Logger.infoLog("Finding User");
    try {
      if (
        !/^[A-Za-z0-9+_.-]+[@]{1}[A-Za-z0-9-]+[.]{1}[A-Za-z.]+$/.test(
          req.body.email
        )
      ) {
        throw new Exception.InvalidEmailFormat("Formato de email invalido");
      }

      console.log(req.body);

      let user = await AuthService.findUserByEmail(req.body.email, customerModel);

      if (!user)
        user = await AuthService.findUserByEmail(req.body.email, producerModels);

      if (!user) {
        return successResponse(res, undefined);
        // throw new Exception.UserNotFound("Usuario nao encontrado");
        
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

        return successResponse(res, undefined);
      }
    } catch (error: any) {
      if (error instanceof Exception.InvalidEmailFormat) {
        Logger.errorLog("Invalid email format");
        return invalidEmailFormat(res);
      } 
      else if (error instanceof Exception.UserNotFound) {
        Logger.errorLog("User not found");
        return userNotFound(res);
      }
      else {
        Logger.errorLog("Resend Email Error: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async confirmationEmail(req: Request, res: Response) {
    try {
      const userID = req.params.id;
      const { codeConfirmation, userType } = req.body;

      if (!codeConfirmation || !userID || !userType) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }

      const emailService = new EmailService();

      if (userType === "Customer") {
        Logger.infoLog("Validating Customer Email");
        await emailService
          .confirmationEmail(userID, codeConfirmation, customerModel)
          .then(() => {
            successResponse(res, undefined);
          })
          .catch((err: any) => {
            throw new Exception.EmailNotConfirmed("Email nao confirmado");
          });
      }

      if (userType === "Producer") {
        Logger.infoLog("Validating Producer Email");
        await emailService
          .confirmationEmail(userID, codeConfirmation, producerModels)
          .then(() => {
            successResponse(res, undefined);
          })
          .catch((err: any) => {
            throw new Exception.EmailNotConfirmed("Email nao confirmado");
          });
      }
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      } else if (error instanceof Exception.EmailNotConfirmed) {
        Logger.errorLog("Email not Confirmed");
        emailNotConfirmed(res);
      }
      else {
        Logger.errorLog("Confirmation Email Error: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!/^[A-Za-z0-9+_.-]+[@]{1}[A-Za-z0-9-]+[.]{1}[A-Za-z.]+$/.test(email)) {
          throw new Exception.InvalidEmailFormat("Formato de email invalido")
      }

      const customer = await AuthService.findUserByEmail(email, customerModel);

      const isProducer = await AuthService.findUserByEmail(
        email,
        producerModels
      );

      if (!customer && !isProducer) {
        throw new Exception.UserNotFound("Email não Cadastrado");
      }

      const emailService = new EmailService();
      await emailService.sendEmailForForgotPassword(email);

      return successResponse(res, undefined);
    }
    catch (error: any) {
      if (error instanceof Exception.InvalidEmailFormat) {
        Logger.errorLog("Invalid email format");
        return invalidEmailFormat(res);
      }
      if (error instanceof Exception.UserNotFound) {
        Logger.errorLog("User is not registered.");
            successResponse(res, undefined);
      }
      else {
        Logger.errorLog("Forgot Password Error: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async resetPassword(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { newPassword, userType } = req.body;

      if (!userType || !newPassword || !id) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }

      Logger.infoLog("Gerando Passhash");
      const hashPassword = await AuthService.hashPassword(newPassword);
      Logger.infoLog("Gen Passhash " + hashPassword);

      await AuthService.changePassword(id, hashPassword, userType)
        .then(() => {
          Logger.infoLog("Operação realizada com sucesso");
          successResponse(res, undefined);
        })
        .catch((err) => {
          throw new Exception.FailedToUpdatePassword("Falha ao atualizar senha");
        });
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      }
      else if (error instanceof Exception.FailedToUpdatePassword) {
        Logger.errorLog("Failed to Update Password");
        failedToUpdatePassword(res);
      }
      else {
        Logger.errorLog("Reset Password Error: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }
}

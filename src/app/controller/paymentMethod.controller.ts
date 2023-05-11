import { AuthService } from "../services/auth.service";
import userService from "../services/user.service";
import { Logger } from "../services/logger.service";
import PaymentMethodService from "../services/paymentMethod.service";
import {
  badRequestResponse,
  createdResponse,
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
  invalidPayment,
  userNotFound
} from "../utils/responses.utils";
import { Request, Response } from "express";
import customerModel from "../models/customer.model";
import mongoose from "mongoose";
import * as Exception from "../exceptions";

export class PaymentMethodController {
  constructor() {}

  public async registerPaymentMethod(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { typePayment, cardNumber, holder, expirationDate, securityCode, saveCard, brand, installments, nickname } =
        req.body;

      const paymentMethods: any = {
        typePayment,
        cardNumber,
        holder,
        expirationDate,
        securityCode,
        saveCard,
        brand,
        installments,
        nickname
      };

      if (
        !id ||
        !paymentMethods.typePayment
      ) {
        throw new Exception.UnprocessableEntityResponse("Campos vazios");
      }

      if (["debit", "credit"].includes(paymentMethods.typePayment)) {
        if (!paymentMethods.cardNumber ||
            !paymentMethods.holder ||
            !paymentMethods.expirationDate ||
            !paymentMethods.securityCode ||
            !paymentMethods.saveCard ||
            !paymentMethods.brand ||
            !paymentMethods.installments ||
            !paymentMethods.nickname) {
              
              throw new Exception.UnprocessableEntityResponse("Campos vazios");
            }
      } else {
        throw new Exception.InvalidPayment("Forma de pagamento invalida");
      }

      const user = await userService.findUser(id, customerModel);

      if(!user){
        Logger.errorLog("Usuario não encontrado")
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      Logger.infoLog(user);

      const paymentMethod = await PaymentMethodService.registerPaymentMethod(
        paymentMethods
      ).catch((err) => {
        throw new Exception.InternalServerErrorResponse("InternalServerErrorResponse");
      });

      Logger.infoLog(paymentMethod);
      user.paymentMethods.push(paymentMethod._id);
      await user.save();

      return createdResponse(res, paymentMethod, "Metodo de Pagamento");
    } catch (err: any) {
      if (err instanceof Exception.UnauthorizedResponse) {
        return unprocessableEntityResponse(res);
      }
      else if (err instanceof Exception.InvalidPayment) {
        return invalidPayment(res);
      }
      else if (err instanceof Exception.UserNotFound) {
        return userNotFound(res);
      }
      else if (err instanceof Exception.InternalServerErrorResponse) {
        return internalServerErrorResponse(res, err.message);
      }
      else {
        Logger.infoLog(err.message);
        return internalServerErrorResponse(res, err.message);
      }
    }
  }

  public async getPaymentMethods(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) throw new Exception.UnprocessableEntityResponse("Campos Nulos");

      const user = await userService.findUser(id, customerModel);
      console.log(user.paymentMethods);
      Logger.infoLog("Populate user");
      const userPpl = await user.populate("paymentMethods");
      // const userPpl = await customerModel.findById(id).populate('paymentMethods').exec();

      console.log(userPpl);
          
      Logger.infoLog("Return paymentMethods");
      // return successResponse(res, userPpl.paymentMethods);
      return successResponse(res, userPpl);
    } catch (err: any) {
      if (err instanceof Exception.UnprocessableEntityResponse) {
        return unprocessableEntityResponse(res);
      }
      else {
        Logger.infoLog(err.message);
        return internalServerErrorResponse(res, err.message);
      }
    }
  }

  public async updatePaymentMethods(req: Request, res: Response) {
    try{
      const paymentMethodId = req.params.id;
      const { typePayment, cardNumber, holder, expirationDate, securityCode, saveCard, brand, installments, nickname } =
        req.body;
      
      if(!paymentMethodId){
        throw new Exception.UnprocessableEntityResponse("Campos Vazios");
      }
      
      const acc = await PaymentMethodService.updatePaymentMethod(paymentMethodId, { typePayment, cardNumber, holder, expirationDate, securityCode, saveCard, brand, installments, nickname })
      return successResponse(res, acc)
    } catch(err: any) {
      if (err instanceof Exception.UnprocessableEntityResponse) {
        return unprocessableEntityResponse(res);
      }
      else{
        return internalServerErrorResponse(res, err)
      }
    }
  } 


  public async deletePaymentMethods(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;

      if (!id || !userId) throw new Exception.UnprocessableEntityResponse("campos vazios");
      // if (!id || !userId) return unprocessableEntityResponse(res);

      const user = await userService.findUser(userId, customerModel);


      if(!user){
        Logger.errorLog("Usuario não encontrado");
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      await PaymentMethodService.deleteItems(id)
        .then(() => {

          Logger.infoLog("Delete id from user model");
          
          userService.removeValueFromArrayField(userId, "paymentMethods", customerModel, id);
          return successResponse(res, null);
        })
        .catch((err: any) => {
          Logger.infoLog("Error " + err.message);
          return internalServerErrorResponse(res, err.message);
        });
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        return unprocessableEntityResponse(res);
      }
      else if (error instanceof Exception.UserNotFound) {
        return userNotFound(res);
      }
      else {
        Logger.infoLog("Error " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }
}

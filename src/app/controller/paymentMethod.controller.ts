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
} from "../utils/responses.utils";
import { Request, Response } from "express";
import customerModel from "../models/customer.model";
import mongoose from "mongoose";

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
        return unprocessableEntityResponse(res);
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
              
            return unprocessableEntityResponse(res);
            }
      }

      const user = await userService.findUser(id, customerModel);

      if(!user){
        Logger.errorLog("Usuario não encontrado")
        return badRequestResponse(res)
      }

      Logger.infoLog(user);

      const paymentMethod = await PaymentMethodService.registerPaymentMethod(
        paymentMethods
      ).catch((err) => {
        return internalServerErrorResponse(res, err.message);
      });

      Logger.infoLog(paymentMethod);
      user.paymentMethods.push(paymentMethod._id);
      await user.save();

      return createdResponse(res, paymentMethod, "Metodo de Pagamento");
    } catch (err: any) {
      Logger.infoLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async getPaymentMethods(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) return unprocessableEntityResponse(res);

    const user = await userService.findUser(id, customerModel);
    console.log(user.paymentMethods);
    Logger.infoLog("Populate user");
    const userPpl = await user.populate("paymentMethods");
    // const userPpl = await customerModel.findById(id).populate('paymentMethods').exec();

    console.log(userPpl);
        
    Logger.infoLog("Return paymentMethods");
    // return successResponse(res, userPpl.paymentMethods);
    return successResponse(res, userPpl);
  }

  public async updatePaymentMethods(req: Request, res: Response) {
    try{

      const paymentMethodId = req.params.id;
      const { typePayment, cardNumber, holder, expirationDate, securityCode, saveCard, brand, installments, nickname } =
        req.body;
      
      if(!paymentMethodId){
        return unprocessableEntityResponse(res)
      }
      
      const acc = await PaymentMethodService.updatePaymentMethod(paymentMethodId, { typePayment, cardNumber, holder, expirationDate, securityCode, saveCard, brand, installments, nickname })
      return successResponse(res, acc)
    } catch(ex) {
      return internalServerErrorResponse(res, ex)
    }
    } 


  public async deletePaymentMethods(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;

      if (!id || !userId) return unprocessableEntityResponse(res);

      const user = await userService.findUser(userId, customerModel);


      if(!user){
        Logger.errorLog("Usuario não encontrado")
        return badRequestResponse(res)
      }

      await PaymentMethodService.deleteItems(id)
        .then(() => {

          Logger.infoLog("Delete id from user model");
          
          userService.removeValueFromArrayField(userId, "paymentMethods", customerModel, id);
          // const idPayMeth = new mongoose.Types.ObjectId(id);
          // const index = user.paymentMethods.findIndex((element: {idPayMeth: mongoose.Types.ObjectId}) => element.idPayMeth === idPayMeth);
          // user.paymentMethods.splice(index, 1);

          user.save();
          return successResponse(res, null);
        })
        .catch((err: any) => {
          Logger.infoLog("Error " + err.message);
          return internalServerErrorResponse(res, err.message);
        });
    } catch (error: any) {
      Logger.infoLog("Error " + error.message);
      return internalServerErrorResponse(res, error.message);
    }
  }
}

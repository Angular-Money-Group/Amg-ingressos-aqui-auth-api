import { AuthService } from "./../services/auth.service";
import userService from "../services/user.service";
import { Logger } from "../services/logger.service";
import ReceiptAccountService from "../services/receipmentAccount.service";
import {
  createdResponse,
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from "../utils/responses.utils";
import { Request, Response } from "express";
import producerModels from "../models/producer.models";

export class AccountBankController {
  constructor() {}

  public async registerAccount(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { cnpj, fullName, bank, bankAgency, bankAccount, bankDigit } =
        req.body;

      const accounts: any = {
        cnpj,
        fullName,
        bank,
        bankAgency,
        bankAccount,
        bankDigit,
      };

      if (
        !id ||
        !accounts.cnpj ||
        !accounts.fullName ||
        !accounts.bank ||
        !accounts.bankAgency ||
        !accounts.bankAccount ||
        !accounts.bankDigit
      ) {
        return unprocessableEntityResponse(res);
      }

      const user = await userService.findUser(id, producerModels);

      Logger.infoLog(user);

      const account = await ReceiptAccountService.registerReceiptBanking(
        accounts
      ).catch((err) => {
        return internalServerErrorResponse(res, err.message);
      });

      Logger.infoLog(account);
      user.receiptAccounts.push(account._id);
      await user.save();

      const userPop = await user.populate("receiptAccounts");

      Logger.infoLog(userPop);

      return createdResponse(res, userPop, "Conta bancaria");
    } catch (err: any) {
      Logger.infoLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async getAccountReceipt(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) return unprocessableEntityResponse(res);

    const user = await userService.findUser(id, producerModels);

    Logger.infoLog("Populate user");
    const userPop = await user.populate("receiptAccounts");
        
    Logger.infoLog("Return accounts");
    return successResponse(res, userPop.receiptAccounts);
  }

  public async updateAccountReceipt(req: Request, res: Response) {
    try{

      const accountId = req.params.id;
      const { cnpj, fullName, bank, bankAgency, bankAccount, bankDigit } =
      req.body;
      
      if(!accountId){
        return unprocessableEntityResponse(res)
      }
      
      const acc = await ReceiptAccountService.updateAccountReceipt(accountId, { cnpj, fullName, bank, bankAgency, bankAccount, bankDigit })
      return successResponse(res, acc)
    } catch(ex) {
      return internalServerErrorResponse(res, ex)
    }
    } 


  public async deleteAccountReceipt(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;

      if (!id || !userId) return unprocessableEntityResponse(res);

      const user = await userService.findUser(userId, producerModels);

      await ReceiptAccountService.deleteItems(id)
        .then(() => {
          Logger.infoLog("Delete id from user model");
          user.receiptAccounts.splice(id, 1);
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

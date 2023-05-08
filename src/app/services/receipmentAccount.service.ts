import dotenv from "dotenv";
import crypto from "crypto";
import { OperationsDB } from "../db/operations.db";
import receiptAccountsModel from "../models/receiptAccounts.model";
import { Logger } from "./logger.service";

dotenv.config();

export default class ReceiptAccountService {
  public secretKey = process.env.CRYPTO_HASH!;

  public static async encryptData(account: any) {
    Logger.infoLog("Encripted account bank");
    Object.keys(account.accounts).forEach(async (key, index) => {
      Logger.infoLog("Encript " + key);
      const cipher = crypto.createCipher(
        "aes-256-cbc",
        process.env.CRYPTO_HASH!
      );
      Logger.infoLog("Created cipher");

      let encrypted = cipher.update(account.accounts[key], "utf8", "hex");
      Logger.infoLog("Encripted " + encrypted);

      encrypted += cipher.final("hex");
      account.accounts[key] = encrypted;
    });

    return account;
  }

  public static async registerReceiptBanking(account: any) {
    Logger.infoLog('registerReceiptBanking')
    const accBank = await OperationsDB.registerItem(
      account,
      receiptAccountsModel
    ).catch((err: any) => {
      return Promise.reject();
    });

    return Promise.resolve(accBank);
  }

  public static async updateAccountReceipt(accountID: any, accountEdit: any){
    const accBank = await OperationsDB.updateItems(
      accountID,
      accountEdit,
      receiptAccountsModel
    ).catch((err: any) => {
      return Promise.reject();
    });

    return Promise.resolve(accBank);
  }

  public static async decryptData(encryptedData: string): Promise<string> {
    const decipher = crypto.createDecipher(
      "aes-256-cbc",
      process.env.CRYPTO_HASH!
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  public static async deleteItems(account: string){
    await OperationsDB.deleteItems(account, receiptAccountsModel).then(() => {
      Logger.infoLog('Deleted Succefull')
      return Promise.resolve()
    }).catch((err: any) => {
      Logger.infoLog('Error ' + err.message)
      return Promise.reject()
    })
  }
}
import dotenv from "dotenv";
import crypto from "crypto";
import { OperationsDB } from "../db/operations.db";
import paymentMethodModel from "../models/paymentMethod.model";
import customerModel from "../models/customer.model";
import { Logger } from "./logger.service";

dotenv.config();

export default class PaymentMethodService {
  public secretKey = process.env.CRYPTO_HASH!;

  public static async encryptData(paymentMethod: any) {
    Logger.infoLog("Encripted payment method");
    Object.keys(paymentMethod.paymentMethods).forEach(async (key, index) => {
      Logger.infoLog("Encript " + key);
      const cipher = crypto.createCipher(
        "aes-256-cbc",
        process.env.CRYPTO_HASH!
      );
      Logger.infoLog("Created cipher");

      let encrypted = cipher.update(paymentMethod.paymentMethods[key], "utf8", "hex");
      Logger.infoLog("Encripted " + encrypted);

      encrypted += cipher.final("hex");
      paymentMethod.paymentMethods[key] = encrypted;
    });

    return paymentMethod;
  }

  public static async registerPaymentMethod(paymentMethod: any) {
    Logger.infoLog('registerPaymentMethod')
    const payMeth = await OperationsDB.registerItem(
      paymentMethod,
      paymentMethodModel
    ).catch((err: any) => {
      return Promise.reject();
    });

    return Promise.resolve(payMeth);
  }

  public static async updatePaymentMethod(paymentMethodID: any, paymentMethodEdit: any){
    const accBank = await OperationsDB.updateItems(
      paymentMethodID,
      paymentMethodEdit,
      paymentMethodModel
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

  public static async deleteItems(paymentMethod: string){
    await OperationsDB.deleteItems(paymentMethod, paymentMethodModel).then(() => {
      Logger.infoLog('Deleted Succefull')
      return Promise.resolve()
    }).catch((err: any) => {
      Logger.infoLog('Error ' + err.message)
      return Promise.reject()
    })
  }
}
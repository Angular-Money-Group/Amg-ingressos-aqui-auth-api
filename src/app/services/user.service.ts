import { OperationsDB } from "../db/operations.db";
import { Model } from "mongoose";
import { Logger } from "./logger.service";

export default class UserService {
  public static async getAll<M extends Model<any>>(model: M) {
    try {
      console.log("User Service, model received:" + model.modelName);
      return Promise.resolve(await OperationsDB.getAll(model));
    } catch {
      return Promise.reject(new Error("Error on paginate"));
    }
  }

  public static async updateUser<M extends Model<any>>(
    id: string,
    user: any,
    model: M
  ) {
    try {
      Logger.infoLog("Update Itens");
      return await OperationsDB.updateItems(id, user, model);
    } catch {
      return Promise.reject(new Error("Error on Update"));
    }
  }

  public static async deleteItems<M extends Model<any>>(id: string, model: M) {
    try {
      Logger.infoLog("Delete User");
      return await OperationsDB.deleteItems(id, model);
    } catch {
      return Promise.reject(new Error("Error on delete"));
    }
  }

  public static async findUser<M extends Model<any>>(
    id: string,
    model: M,
    populateOptions?: any
  ) {
    try {
      Logger.infoLog("Finding User");
      return await OperationsDB.getById(id, model, populateOptions);
    } catch {
      return Promise.reject(new Error("Error find user by id"));
    }
  }

  public static async removeValueFromArrayField<M extends Model<any>>(elementId: string, fieldName: string, model: M, valueToRemove: string) {
    // const idObject = new mongoose.Types.ObjectId(valueToRemove);
    const { ObjectId } = require('mongodb');
    const idExternal =  new ObjectId(valueToRemove);
    console.log("ObjectId: " + valueToRemove);
    await OperationsDB.removeValueFromArrayField(elementId, fieldName, model, idExternal).then(() => {
      Logger.infoLog('Deleted Succefull')
      return Promise.resolve()
    }).catch((err: any) => {
      Logger.infoLog('Error ' + err.message)
      return Promise.reject()
    })
  }
}

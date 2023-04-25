import { OperationsDB } from "../db/operations.db";
import { Model } from "mongoose";
import { Logger } from "./logger.service";

export default class UserService {

 public static async updateUser<M extends Model<any>>(id: string, user: any, model: M){
    Logger.infoLog('Update Itens')
    await OperationsDB.updateItems(id, user, model).then(() => {
        Logger.infoLog('Sucesso ao update')
        return Promise.resolve()
    }).catch((err) => {
        Logger.errorLog(err.message)
        Promise.reject()
    })
 }

 public static async findUser<M extends Model<any>>(id: string, model: M, populateOptions?: any){
    const user = await OperationsDB.getById(id, model)

    return Promise.resolve(user)
 }
}

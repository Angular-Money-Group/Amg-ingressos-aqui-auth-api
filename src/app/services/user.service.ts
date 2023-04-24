import { OperationsDB } from "../db/operations.db";
import { Model } from "mongoose";
import { Logger } from "./logger.service";

export class UserService {

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

}

export default { UserService };

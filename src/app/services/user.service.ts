import { OperationsDB } from "../db/operations.db";
import { Model } from "mongoose";
import { Logger } from "./logger.service";
import { IPagination, findPaginated } from "../utils/pagination.utils";

export default class UserService {
  public static async getAll<M extends Model<any>>(
    model: M,
    options: IPagination,
    filter: string
  ) {
    try {
      Logger.infoLog("Get itens Paginate " + options);
      if (filter) {
        return await findPaginated(
          model,
          options.page,
          options.pageSize,
          {
            name: { $regex: filter, $options: "i" },
          },
          options.sort
        );
      } else {
        return await findPaginated(
          model,
          options.page,
          options.pageSize,
          {},
          options.sort
        );
      }
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
      await OperationsDB.updateItems(id, user, model)
        .then(() => {
          Logger.infoLog("Sucesso ao update");
          return Promise.resolve();
        })
        .catch((err) => {
          Logger.errorLog(err.message);
          Promise.reject();
        });
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
      return Promise.reject(new Error("Error on paginate"));
    }
  }
}

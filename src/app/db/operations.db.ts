import { Model } from "mongoose";
import { Logger } from "../services/logger.service";

export class OperationsDB {
  public static async registerItem<M extends Model<any>>(
    item: any,
    model: M
  ): Promise<any> {
    try {
      Logger.infoLog(`Create ${model.modelName}: ${item}`);
      const itemCreated = await new model(item).save().catch((err: any) => {
        Logger.errorLog(err.message);
        return Promise.reject(err.message);
      });
      
      Logger.infoLog(
        `Create ${model.modelName} id: ${itemCreated._id.toString()}`
      );
      return Promise.resolve(itemCreated);
    } catch (error: any) {
      Logger.errorLog(error.message);
      return Promise.reject(error.message);
    }
  }

  public static async updateItems<M extends Model<any>>(
    id: string,
    items: any,
    model: M
  ): Promise<any> {
    try {
      const update = await model
        .findByIdAndUpdate({ _id: id }, { $set: items }, { new: true })
        .then((res) => {
          Logger.infoLog(res);
          return res;
        })
        .catch((err) => {
          Logger.errorLog(err.message);
          return err
        });

      Logger.infoLog(`Update in ${model.modelName} item of id: ${id}`);
      Logger.infoLog(update);
      return Promise.resolve(update);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  public static async deleteItems<M extends Model<any>>(
    id: string,
    model: M
  ): Promise<any> {
    try {
      Logger.infoLog(`Delete in ${model.modelName} item of id: ${id}`);
      const deleteItem = await model.findByIdAndDelete(id).catch((err: any) => {
        Logger.errorLog(err.message);
        throw new Error(err.message);
      });
      return Promise.resolve(deleteItem);
    } catch (error: any) {
      Logger.errorLog(error.message);
      return error.message;
    }
  }

  public static async getById<M extends Model<any>>(
    id: string,
    model: M,
    populateOptions?: any
  ): Promise<any> {
    try {
      Logger.infoLog(`Get ${model.modelName} id: ${id}`);
      return Promise.resolve(
        await model.findById(id).populate(populateOptions)
      );
    } catch (error: any) {
      Logger.errorLog(error.message);
      return error.message;
    }
  }

  public static async getAll<M extends Model<any>>(model: M): Promise<any> {
    try {
      Logger.infoLog(`Get all ${model.modelName}`);
      return Promise.resolve(await model.find());
    } catch (error: any) {
      Logger.errorLog(error.message);
      return Promise.reject(error.message);
    }
  }

  public static async getItemsByDay<M extends Model<any>>(
    day: string,
    model: M
  ) {
    try {
      Logger.infoLog(`Get all by day ${day} in ${model.modelName}`);
      return Promise.resolve(
        await model.find({
          createdAt: {
            $gte: new Date(day),
            $lt: new Date(day).setDate(new Date(day).getDate() + 1),
          },
        })
      );
    } catch (error: any) {
      Logger.errorLog(error.message);
      return Promise.reject(error.message);
    }
  }

  public static async addIdToRelatedCollection<M extends Model<any>>(
    id: string,
    childId: string,
    itemToUpdate: string,
    model: M
  ) {
    try {
      Logger.infoLog(`Add id ${childId} to ${model.modelName} id: ${id}`);
      model
        .findById(id)
        .then((res: any) => {
          res[itemToUpdate].push(childId);
          res.save();
        })
        .catch((err: any) => {
          Logger.errorLog(err.message);
          return Promise.reject(err.message);
        });
      return Promise.resolve();
    } catch (error: any) {
      Logger.errorLog(error.message);
      return Promise.reject(error.message);
    }
  }

  public static async findByEmail<M extends Model<any>>(
    email: string,
    model: M
  ): Promise<any> {
    try {
      Logger.infoLog(`Get all by email ${email} in ${model.modelName}`);
      return Promise.resolve(await model.findOne({ email: email }));
    } catch (error: any) {
      Logger.errorLog(error.message);
      return Promise.reject(error.message);
    }
  }
}

import { DBOperators } from './../db/operations.db';
import { Document, Model } from 'mongoose';
import EventModel, { EventType } from "../models/event.models";
import variantModel from '../models/variant.model';
import daysModel, { DaysType } from './../models/days.models';
import lotsModels, { LotsType } from './../models/lots.models';
import { VariantType } from './../models/variant.model';
import vipareaModel, { VIPAreaType } from './../models/viparea.model';
import { Logger } from "./logger.service";

export class EventService {
  public static async getAllEvents() {
    return EventModel.find().populate('days').populate('lots').populate('VIPArea').populate('producer').exec()
      .then((result) => {
        Logger.infoLog("Get all events result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Get all events error: " + error);
        return error;
      });
  }

  public static async findEventById(value: string): Promise<any> {
    return EventModel.findById(value).populate('days').populate('lots').populate('VIPArea').populate('producer').exec()
      .then((result) => {
        Logger.infoLog("Find event by id result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find event by id error: " + error);
        return error;
      });
  }

  public static async findEventByType(value: EventType): Promise<any> {
    return EventModel.find({ type: value })
      .then((result) => {
        Logger.infoLog("Find event by type result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find event by type error: " + error);
        return error;
      });
  }

  public static async findEventByDate(value: Date): Promise<any> {
    return EventModel.find({ date: value })
      .then((result) => {
        Logger.infoLog("Find event by date result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find event by date error: " + error);
        return error;
      });
  }

    public static async findEventByProducer(value: string): Promise<any> {
        return EventModel.find({ producer: value }).populate('producer').exec().then((result) => {
            Logger.infoLog("Find event by producer result: " + result);
            return result;
        }
        ).catch((error) => {
            Logger.errorLog("Find event by producer error: " + error);
            return error;
        });
    }

    public static async deleteEvent(id: string): Promise<any> {
        return DBOperators.deleteItem<any>(id, EventModel).then((result) => {
            Logger.infoLog("Delete event result: " + result);
            return result;
        }).catch((error) => {
            Logger.errorLog("Delete event error: " + error);
            return error;
        });
    }

    public static async createEvent(event: EventType): Promise<EventType> {
        const daysIds = await this.createItems<DaysType, Model<DaysType>>(event.days, daysModel);
        const lotsIds = await this.createItems<LotsType, Model<LotsType>>(event.lots, lotsModels);
        const vipAreaIds = await this.createItems<VIPAreaType, Model<VIPAreaType>>(event.VIPArea, vipareaModel);

        Logger.infoLog(`Created Relations: daysIds: ${daysIds}, lotsIds: ${lotsIds}, vipAreaIds: ${vipAreaIds}`);

        const eventCreated = await new EventModel({
            name: event.name,
            local: event.local,
            type: event.type,
            image: event.image,
            description: event.description,
            cep: event.cep,
            address: event.address,
            number: event.number,
            complement: event.complement,
            neighborhood: event.neighborhood,
            city: event.city,
            state: event.state,
            referencePoint: event.referencePoint,
            days: daysIds,
            lots: lotsIds,
            VIPArea: vipAreaIds,
        }).save();

        Logger.infoLog(`Created Event: ${eventCreated}`);

        return Promise.resolve(eventCreated);
    }

    private static async createItems<T extends Document, M extends Model<T>>(items: T[] | any[], model: M): Promise<string[]> {
      const itemIds: string[] = [];
    
      for await (let item of items) {

        if(model.modelName === 'Lots') {
          Logger.infoLog('Create Lots Variant')

          item = item as unknown as LotsType;
          Logger.infoLog('Converting Data')

          const variantId = await this.createItems<VariantType, Model<any>>(item.variant, variantModel);
          item.variant = variantId;
          
          Logger.infoLog('Created Variant')
        }

        const itemId = await new model(item).save();
        Logger.infoLog(`Create ${model.modelName}: ${item}`);
    
        itemIds.push(itemId._id.toString());
        Logger.infoLog(`Create ${model.modelName} id: ${itemId._id.toString()}`);
      }
    
      return itemIds
    }
}

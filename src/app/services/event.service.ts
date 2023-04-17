import { Model } from "mongoose";
import { OperationsDB } from "../db/operations.db";
import EventModel, { EventType } from "../models/event.models";
import variantModel from "../models/variant.model";
import daysModel, { DaysType } from "./../models/days.models";
import lotsModels, { LotsType } from "./../models/lots.models";
import vipareaModel, { VIPAreaType } from "./../models/viparea.model";
import { Logger } from "./logger.service";

export class EventService {
  public static async getAllEvents() {
    return EventModel.find()
      .populate("days")
      .populate("lots")
      .populate("VIPArea")
      .exec()
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
    return EventModel.findById(value)
      .populate("days")
      .populate("lots")
      .populate("VIPArea")
      .exec()
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
    return EventModel.find({ producer: value })
      .populate("producer")
      .exec()
      .then((result) => {
        Logger.infoLog("Find event by producer result: " + result);
        return result;
      })
      .catch((error) => {
        Logger.errorLog("Find event by producer error: " + error);
        return error;
      });
  }

  public static async deleteEvent(id: string): Promise<any> {
    return OperationsDB.deleteItems<any>(id, EventModel)
      .then((result: any) => {
        Logger.infoLog("Delete event result: " + result);
        return result;
      })
      .catch((error: any) => {
        Logger.errorLog("Delete event error: " + error);
        return error;
      });
  }

  public static async createEvent(event: any): Promise<EventType> {

    let vipAreaIds: string[] = []

    Logger.infoLog("Creating Days: " + event.days);
    const daysIds = await this.createItems<Model<DaysType>>(
      event.days,
      daysModel
    );
    
    Logger.infoLog("Creating Lots: " + event.lots);
    const lotsIds = await this.createItems<Model<LotsType>>(
      event.lots,
      lotsModels
    );

    if(event.VIPArea && event.VIPArea.length > 0){
      Logger.infoLog("Creating VIPArea: " + event.VIPArea);
      vipAreaIds = await this.createItems<Model<VIPAreaType>>(
        event.VIPArea,
        vipareaModel
        );
        
        Logger.infoLog(
          `Created Relations: daysIds: ${daysIds}, lotsIds: ${lotsIds}, vipAreaIds: ${vipAreaIds}`
          );
        }

    const eventCreated = await new EventModel({
      name: event.name,
      local: event.local,
      type: event.type.name,
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

  private static async createItems<M extends Model<any>>(
    items: any[],
    model: M
  ): Promise<string[]> {
    const itemIds: string[] = [];

    Logger.infoLog("Creating Items: " + items);
    for (let item of items) {

      if (model.modelName === "Lots") {
        Logger.infoLog("Create Lots Variant");

        item = item as unknown as LotsType;
        Logger.infoLog("Converting Data");

        const variantId: any = await this.createItems<Model<any>>(
          item.variant,
          variantModel
        );
        item.variant = variantId;

        Logger.infoLog("Created Variant");
      }

      if (model.modelName === "VIPArea") {
        Logger.infoLog("Create VIPArea Variant");
        item = item as unknown as VIPAreaType;
        Logger.infoLog("Converting Data");
        let ticketsAreaArray = [];

        for await (let ticketsArea of item.ticketsArea) {
          Logger.infoLog("Create TicketsArea");
          const ticket = {
            position: ticketsArea,
            isReserved: false,
            isSold: false,
          };

          Logger.infoLog("Created TicketsArea " + ticket);

          ticketsAreaArray.push(ticket);
        }

        Logger.infoLog("Created TicketsArea Array " + ticketsAreaArray);
        item.ticketsArea = ticketsAreaArray;

        Logger.infoLog("Created VIPArea Variant " + item);
      }


      Logger.infoLog("Create Item");
      const itemId = await new model(item).save();

      Logger.infoLog(`Create ${model.modelName}: ${item}`);
      Logger.infoLog("Push Item Id");

      itemIds.push(itemId._id.toString());
      Logger.infoLog(`Create ${model.modelName} id: ${itemId._id.toString()}`);
    }

    return itemIds;
  }
}
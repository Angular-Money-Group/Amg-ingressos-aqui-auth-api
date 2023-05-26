import { OperationsDB } from "./../db/operations.db";
import ticketSupportModels, {
  TicketSupport,
} from "../models/ticketSupport.models";
import dotenv from "dotenv";

dotenv.config();

export default class SupportService {
  public async save(ticket: TicketSupport): Promise<any> {
    try {
      const pResult = await OperationsDB.registerItem(
        ticket,
        ticketSupportModels
      );
      return Promise.resolve(pResult);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  public async getAll(): Promise<any> {
    try {
      const pResult = await OperationsDB.getAll(ticketSupportModels);

      return Promise.resolve(pResult);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  public async get(id: string): Promise<any> {
    try {
      const pResult = await OperationsDB.getById(id, ticketSupportModels);
      console.log(pResult);
      return pResult;
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  public async updateTicket(id: string, state: string): Promise<any> {
    try {
      const pResult = await OperationsDB.updateItems(
        id,
        {state},
        ticketSupportModels
      );
      return Promise.resolve(pResult);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      const pResult = await OperationsDB.deleteItems(id, ticketSupportModels);
      return Promise.resolve(pResult);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }
}

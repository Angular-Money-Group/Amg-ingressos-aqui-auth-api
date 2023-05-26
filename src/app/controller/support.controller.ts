import {
  createdResponse,
  internalServerErrorResponse,
  noContentResponse,
  successResponse,
  unprocessableEntityResponse,
} from "../utils/responses.utils";
import EmailService from "../services/emails.service";
import { Request, Response } from "express";
import { Logger } from "../services/logger.service";
import SupportService from "../services/support.service";

const supportService = new SupportService()
const emailService = new EmailService()

export class SupportController {
  constructor(
  ) {}

  public async createTicketSupport(req: Request, res: Response) {
    const { email, message, phoneNumber, subject } = req.body;

    if (!email || !message || !phoneNumber || !subject)
      return unprocessableEntityResponse(res);

    const emailObj = { email, message, phoneNumber, subject };
    try {
      emailService.sendSupportEmail(emailObj);
      await supportService.save(emailObj);

      return createdResponse(res, emailObj, "Ticket");
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async getAllTicketSupport(req: Request, res: Response) {
    try {
      const pResult = await supportService.getAll();

      if (pResult.length === 0) {
        return noContentResponse(res);
      }

      return successResponse(res, pResult);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async getTicketSupport(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) return unprocessableEntityResponse(res);

      const pResult = await supportService.get(id);

      if (!pResult) {
        return noContentResponse(res);
      }

      return successResponse(res, pResult);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async updateStatusTicketSupport(req: Request, res: Response) {
    const id = req.params.id;
    const { status } = req.body;

    if (!id || !status) return unprocessableEntityResponse(res);

    try {
      const pResult = await supportService.updateTicket(id, status);

      return successResponse(res, pResult);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async deleteTicketSupport(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) return unprocessableEntityResponse(res);

    try {
      await supportService.delete(id);

      return successResponse(res, null);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }
}

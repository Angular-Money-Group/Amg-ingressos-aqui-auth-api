import {
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from "../utils/responses.utils";
import EmailService from "../services/emails.service";
import { Request, Response } from "express";
import { Logger } from "../services/logger.service";

const emailService = new EmailService();

export class SupportController {
  public async sendEmailtoSupport(req: Request, res: Response) {
    const { email, message, phoneNumber, subject } = req.body;

    if (!email || !message || !phoneNumber || !subject)
      return unprocessableEntityResponse(res);

    const emailObj = { email, message, phoneNumber, subject };
    try {
      emailService.sendSupportEmail(emailObj);

      return successResponse(res, null);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }
}

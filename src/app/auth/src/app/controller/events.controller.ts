import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { Logger } from "./../services/logger.service";
import {
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from "./../utils/responses.utils";

export const createEvent = (req: Request, res: Response) => {
  try {
    const event = req.body;

    if (
      !event.name ||
      !event.local ||
      !event.type ||
      !event.image ||
      !event.description ||
      !event.cep ||
      !event.address ||
      !event.number ||
      !event.complement ||
      !event.neighborhood ||
      !event.city ||
      !event.state ||
      !event.referencePoint ||
      !event.days ||
      !event.lots
    ) {
      Logger.errorLog("Missing fields");
      return unprocessableEntityResponse(res);
    }

    EventService.createEvent(event)
      .then((result) => {
        Logger.infoLog("Event created: " + result);
        return successResponse(res, result);
      })
      .catch((error) => {
        Logger.errorLog("Error creating event: " + error);
        return internalServerErrorResponse(res, error.message);
      });
  } catch (error: any) {
    Logger.errorLog("Error creating event: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export const findEventById = (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      Logger.errorLog("Missing fields");
      return unprocessableEntityResponse(res);
    }

    EventService.findEventById(eventId)
      .then((result) => {
        Logger.infoLog("Event found: " + result);
        return successResponse(res, result);
      })
      .catch((error) => {
        Logger.errorLog("Error finding event: " + error);
        return internalServerErrorResponse(res, error.message);
      });
  } catch (error: any) {
    Logger.errorLog("Error finding event: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export const deleteEvent = (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      Logger.errorLog("Missing fields");
      return unprocessableEntityResponse(res);
    }

    EventService.deleteEvent(eventId)
      .then((result) => {
        Logger.infoLog("Event deleted: " + result);
        return successResponse(res, result);
      })
      .catch((error) => {
        Logger.errorLog("Error deleting event: " + error);
        return internalServerErrorResponse(res, error.message);
      });
  } catch (error: any) {
    Logger.errorLog("Error deleting event: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export const getAllEvents = (req: Request, res: Response) => {
  try {
    EventService.getAllEvents()
      .then((result) => {
        Logger.infoLog("Events found: " + result);
        return successResponse(res, result);
      })
      .catch((error) => {
        Logger.errorLog("Error finding events: " + error);
        return internalServerErrorResponse(res, error.message);
      });
  } catch (error: any) {
    Logger.errorLog("Error finding events: " + error);
    return internalServerErrorResponse(res, error.message);
  }
};

export default { createEvent, findEventById, deleteEvent, getAllEvents };
import colabModels, { ColabType } from "./../models/colab.models";
import { Request, Response } from "express";
import { Model } from "mongoose";
import * as Exception from "../exceptions";
import customerModel from "../models/customer.model";
import producerModels, { ProducerType } from "../models/producer.models";
import { Logger } from "../services/logger.service";
import UserService from "../services/user.service";
import { AuthService } from "./../services/auth.service";
import {
  internalServerErrorResponse,
  modelNotFound,
  noContentResponse,
  notFoundResponse,
  successResponse,
  unprocessableEntityResponse,
  userNotFound,
} from "./../utils/responses.utils";
import ticketModels from "../models/ticket.models";

export class UserController {
  constructor() {}

  public async findCustomerById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }
      Logger.infoLog("Pegando costumer por Id");

      console.log(id);

      let user = await UserService.findUser(id, customerModel);

      if (!user) {
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      return successResponse(res, { customer: user });
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      } else if (error instanceof Exception.UserNotFound) {
        Logger.errorLog("User not found");
        return userNotFound(res);
      } else {
        Logger.errorLog("Get Costumer By Id: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async findProducerById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Exception.UnprocessableEntityResponse("Campos Nulos");
      }
      Logger.infoLog("Pegando producer por Id");

      let user = await UserService.findUser(id, producerModels);

      if (!user) {
        throw new Exception.UserNotFound("Usuario nao encontrado");
      }

      return successResponse(res, { producer: user });
    } catch (error: any) {
      if (error instanceof Exception.UnprocessableEntityResponse) {
        Logger.errorLog("Missing params");
        return unprocessableEntityResponse(res);
      } else if (error instanceof Exception.UserNotFound) {
        Logger.errorLog("User not found");
        return userNotFound(res);
      } else {
        Logger.errorLog("Get Producer By Id: " + error.message);
        return internalServerErrorResponse(res, error.message);
      }
    }
  }

  public async GetAllUsers(req: Request, res: Response) {
    try {
      const userType = req.query.userType;

      let model: Model<any>;

      if (userType === "Producer") {
        model = producerModels;
      } else if (userType === "Customer") {
        model = customerModel;
      } else {
        throw new Exception.ModelNotFound(
          "userType não é igual a Producer ou Customer"
        );
      }

      Logger.infoLog("Get users");
      var users = await UserService.getAll(model);

      users.forEach((element: any) => {
        if (element._id == req.body.user.user._id) {
          users.splice(users.indexOf(element));
        }
      });

      users = users.map((element: any) => {
        element.password = undefined;
        return element;
      });
      if (!users) {
        Logger.errorLog("No users found");
        return noContentResponse(res);
      }

      return successResponse(res, users);
    } catch (err: any) {
      if (err instanceof Exception.ModelNotFound) {
        return modelNotFound(res);
      }
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async getTicketsByUserID(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      if (!userId) return unprocessableEntityResponse(res);

      const tickets = await UserService.findTicketsByUser(userId);

      ticketModels

      return successResponse(res, tickets);
    } catch (err: any) {
      return internalServerErrorResponse(res, err);
    }
  }

  public async getAllColabs(req: Request, res: Response) {
    try {
      const idProducer: any = req.params.idProducer;

      if (!idProducer) {
        return unprocessableEntityResponse(res);
      }

      const producer: ProducerType = await UserService.getAllColabs(idProducer);

      let colabs = producer.colabs;

      return successResponse(res, colabs);
    } catch (err: any) {
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async updateColab(req: Request, res: Response) {
    const id: any = req.params.id;

    const { name, email, cpf, password } = req.body;

    if (!id) {
      Logger.errorLog("Missing Fields");
      return unprocessableEntityResponse(res);
    }

    const hashPassword = await AuthService.hashPassword(password);
    Logger.infoLog("Gen Passhash" + hashPassword);

    const userUpdate = await UserService.updateUser(
      id,
      { name, email, cpf, password: hashPassword },
      colabModels
    );

    return successResponse(res, userUpdate);
  }

  public async updateUser(req: Request, res: Response) {
    const id: any = req.params.id;
    const { userType } = req.body;

    if (!id || !userType) {
      Logger.errorLog("Missing Fields");
      return unprocessableEntityResponse(res);
    }

    try {
      Logger.infoLog(userType);
      if (userType === "Customer") {
        const {
          name,
          email,
          phoneNumber,
          cep,
          address,
          houseNumber,
          complement,
          neighborhood,
          city,
          state,
        } = req.body;

        const user = {
          name,
          email,
          phoneNumber,
          cep,
          address,
          houseNumber,
          complement,
          neighborhood,
          city,
          state,
        };

        const userUpdate = await UserService.updateUser(
          id,
          user,
          customerModel
        );

        const { accessToken, refreshToken } = await AuthService.generateTokens({
          user: userUpdate,
          userType,
        });

        Logger.infoLog("Send token to cookies");
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
        });

        Logger.infoLog("Update Success");
        return successResponse(res, { user: userUpdate, accessToken });
      } else if (userType === "Producer") {
        const {
          manager,
          corporateName,
          email,
          phoneNumber,
          cep,
          address,
          houseNumber,
          complement,
          neighborhood,
          city,
          state,
        } = req.body;

        const user = {
          manager,
          corporateName,
          email,
          phoneNumber,
          cep,
          address,
          houseNumber,
          complement,
          neighborhood,
          city,
          state,
        };
        const userUpdate = await UserService.updateUser(
          id,
          user,
          producerModels
        );

        const { accessToken, refreshToken } = await AuthService.generateTokens({
          user: userUpdate,
          userType,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
        });
        Logger.infoLog("Send token to cookies");

        Logger.infoLog("Update Success");
        return successResponse(res, { user: userUpdate, accessToken });
      } else {
        return notFoundResponse(res);
      }
    } catch (err: any) {
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const id: any = req.params.id;
      const userType = req.query.userType;

      if (!id || !userType) return unprocessableEntityResponse(res);

      let model;

      userType === "Producer"
        ? (model = producerModels)
        : (model = customerModel);

      const userUpdate = await UserService.updateUser(
        id,
        { isActive: false },
        model
      );
      userUpdate.password = undefined;
      return successResponse(res, userUpdate);
    } catch (err: any) {
      Logger.infoLog("Error " + err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }

  public async deleteColab(req: Request, res: Response){
    const idColab: any = req.params.idColab;
    const idProducer: any = req.params.idProducer;

    if (!idProducer || !idColab) {
      return unprocessableEntityResponse(res);
    }

    try {

      await UserService.deleteItems(idColab, colabModels)
      const producer: ProducerType = await UserService.findUser(idProducer, producerModels)

      producer.colabs?.splice(idColab, 1)
      producer.save()

      return successResponse(res, null)
    } catch(err: any){
      return internalServerErrorResponse(res, err)
    }

  }
}

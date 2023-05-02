import { Request, Response } from "express";
import customerModel from "../models/customer.model";
import producerModels from "../models/producer.models";
import { Logger } from "../services/logger.service";
import UserService from "../services/user.service";
import {
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from "../utils/responses.utils";
import { AuthService } from "./../services/auth.service";
import { IPagination } from "./../utils/pagination.utils";
import {
  noContentResponse,
  notFoundResponse,
} from "./../utils/responses.utils";

export class UserController {
  constructor() {}

  public async GetAllUsers(req: Request, res: Response) {
    try {
      const { page, pageSize, filter } = req.query as IPagination;
      const { userType } = req.body;

      let model;

      userType === "Producer"
        ? (model = producerModels)
        : (model = customerModel);

      Logger.infoLog("Get Options to paginate");
      const options = {
        page: parseInt(page as unknown as string) || 1,
        pageSize: parseInt(pageSize as unknown as string) || 10,
        sort: { createdAt: -1 },
      };

      Logger.infoLog("Get users");
      const users: any = await UserService.getAll(model, options, filter!);

      Logger.infoLog(users);
      if (!users) {
        Logger.errorLog("No users found");
        return noContentResponse(res);
      }

      return successResponse(res, users);
    } catch (err: any) {
      Logger.errorLog(err.message);
      return internalServerErrorResponse(res, err.message);
    }
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
          userUpdate,
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
          userUpdate,
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
      const { userType } = req.body;

      if (!id || !userType) return unprocessableEntityResponse(res);

      let model;

      userType === "Producer"
        ? (model = producerModels)
        : (model = customerModel);

      await UserService.deleteItems(id, model);
      return successResponse(res, null);
    } catch (err: any) {
      Logger.infoLog("Error " + err.message);
      return internalServerErrorResponse(res, err.message);
    }
  }
}

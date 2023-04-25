import { AuthService } from "./../services/auth.service";
import { notFoundResponse } from "./../utils/responses.utils";
import { Logger } from "../services/logger.service";
import UserService from "../services/user.service";
import customerModel from "../models/customer.model";
import { Request, Response } from "express";
import {
  internalServerErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from "../utils/responses.utils";
import producerModels from "../models/producer.models";

export class UserController {
  constructor() {}

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

        await UserService.updateUser(id, user, customerModel).then(() => {
          return successResponse(res, user);
        });
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
        await UserService.updateUser(id, user, producerModels)
          .then(async () => {
            const { accessToken, refreshToken } =
              await AuthService.generateTokens({ user, userType });

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
            });
            Logger.infoLog("Send token to cookies");

            Logger.infoLog("Update Success");
            return successResponse(res, { user, accessToken });
          })
          .catch((err) => {
            Logger.errorLog(err.message);
            return internalServerErrorResponse(res, err.message);
          });
      } else {
        return notFoundResponse(res);
      }
    } catch (err: any) {
      return internalServerErrorResponse(res, err.message);
    }
  }
}

import { TokenValidation } from "../utils/verifytoken";
import { SupportController } from "./../controller/support.controller";
import { Router } from "express";

export class SupportRouter {
  public supportRouter: Router = Router();

  constructor(
    private supportController: SupportController,
    private tokenValidation: TokenValidation
  ) {
    this.supportRouter.get(
      "/",
      this.tokenValidation.verifyAdminPermission,
      this.supportController.getAllTicketSupport
    );
    this.supportRouter.post("/", this.supportController.createTicketSupport);

    this.supportRouter.get(
      "/:id",
      this.tokenValidation.verifyAdminPermission,
      this.supportController.getTicketSupport
    );
    this.supportRouter.put(
      "/:id",
      this.tokenValidation.verifyAdminPermission,
      this.supportController.updateStatusTicketSupport
    );
    this.supportRouter.delete(
      "/:id",
      this.tokenValidation.verifyAdminPermission,
      this.supportController.deleteTicketSupport
    );
  }
}

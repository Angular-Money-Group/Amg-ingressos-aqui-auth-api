import { AuthController } from "./../controller/auth.controller";
import { Router } from "express";

export class AuthRouter {
  public authRouter = Router();

  constructor(private authController: AuthController) {
    this.authRouter.get("/logout", this.authController.logout);
    this.authRouter.post("/login", this.authController.login);
    this.authRouter.post(
      "/registerCustomer",
      this.authController.registerCustomer
    );
    this.authRouter.post(
      "/registerProducer",
      this.authController.registerProducer
    );
    this.authRouter.post("/refreshToken", this.authController.refreshToken);
    this.authRouter.post("/confirmEmail/:id", this.authController.confirmationEmail)
  }
}

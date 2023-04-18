import { AuthController } from "./../controller/auth.controller";
import { Request, Response, Router } from "express";

export class AuthRouter {
  public authRouter = Router();

  constructor(private authController: AuthController) {
    /**
     * @openapi
     * /logout:
     *  get:
     *     tags:
     *     - Auth
     *     description: Desalogar usuario
     *     responses:
     *       200:
     *         description: Success response
     */
    this.authRouter.get("/logout", this.authController.logout);

        /**
     * @openapi
     * /forgotPassword:
     *  get:
     *     tags:
     *     - Auth
     *     description: Esqueci minha senha
     *     responses:
     *       200:
     *         description: Email enviado
     */
    this.authRouter.post("/forgotPassword", this.authController.forgotPassword)
    
        /**
     * @openapi
     * /login:
     *  get:
     *     tags:
     *     - Auth
     *     description: Logar Usuario
     *     responses:
     *       200:
     *         description: Success response
     */
    this.authRouter.post("/login", this.authController.login);
    this.authRouter.post("/registerCustomer", this.authController.registerCustomer);
    this.authRouter.post("/registerProducer", this.authController.registerProducer);
    this.authRouter.post("/refreshToken", this.authController.refreshToken);
    this.authRouter.post("/resendEmail", this.authController.resendEmail)
    this.authRouter.post("/confirmEmail/:id", this.authController.confirmationEmail)
    this.authRouter.post("/resetPassword/:id", this.authController.resetPassword)
  }
}

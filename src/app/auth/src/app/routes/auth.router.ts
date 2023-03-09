import { Router } from "express";

import AuthController from "../controller/auth.controller";

const authRouter = Router();

authRouter.get("/getUser", AuthController.getUser);
authRouter.get("/logout", AuthController.logout);
authRouter.post("/login", AuthController.login);
authRouter.post("/registerCustomer", AuthController.registerCustomer);
authRouter.post("/registerProducer", AuthController.registerProducer);
authRouter.post("/refreshToken", AuthController.refreshToken);


export default authRouter;
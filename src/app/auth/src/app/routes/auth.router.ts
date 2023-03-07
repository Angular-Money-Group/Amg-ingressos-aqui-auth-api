import { Router } from "express";

import AuthController from "../controller/auth.controller";

const authRouter = Router();

authRouter.get("/getUser", AuthController.getUser);
authRouter.post("/login", AuthController.login);
authRouter.post("/registerCustomer", AuthController.registerCustomer);
authRouter.post("/registerProducer", AuthController.registerProducer);
authRouter.post("/refreshToken", AuthController.refreshToken);
authRouter.post("/logout", AuthController.logout);


export default authRouter;
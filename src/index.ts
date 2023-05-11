import { TokenValidation } from "./app/utils/verifytoken";
import { AccountBankController } from "./app/controller/accountBank.controller";
import { UserController } from "./app/controller/user.controller";
import { UserRouter } from "./app/routes/user.router";
import { App } from "./app";
import { AuthController } from "./app/controller/auth.controller";
import { AuthRouter } from "./app/routes/auth.router";
import { Logger } from "./app/services/logger.service";
import { ReceipmentAccountRouter } from "./app/routes/receipmentAccount.router";
import { SupportRouter } from "./app/routes/support.router";
import { SupportController } from "./app/controller/support.controller";
import { PaymentMethodController } from "./app/controller/paymentMethod.controller";
import { PaymentMethodRouter } from "./app/routes/paymentMethod.router";

const port = 3001;

const userController = new UserController();
const authController = new AuthController();
const supportController = new SupportController();
const accountBankController = new AccountBankController();
const paymentMethodController = new PaymentMethodController();
const tokenValidation = new TokenValidation();

const authRouter = new AuthRouter(authController);
const supportRouter = new SupportRouter(supportController);
const receipmentAccountRouter = new ReceipmentAccountRouter(
  accountBankController,
  tokenValidation
);
const paymentMethodRouter = new PaymentMethodRouter(
  paymentMethodController,
  tokenValidation
);
const userRouter = new UserRouter(userController, tokenValidation);

new App(authRouter, userRouter, receipmentAccountRouter, paymentMethodRouter, supportRouter).server
  .listen(port, () => {
    Logger.infoLog(`Server running on port ${port}`);
  })
  .on("error", (err: any) => {
    Logger.errorLog(`Server error: ${err.message}`);
  });

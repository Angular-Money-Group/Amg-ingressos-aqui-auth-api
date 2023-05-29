import { AuthController } from "./app/controller/auth.controller";
import { App } from "./app";
import { AuthRouter } from "./app/routes/auth.router";
import { PaymentMethodRouter } from "./app/routes/paymentMethod.router";
import { ReceipmentAccountRouter } from "./app/routes/receipmentAccount.router";
import { SupportRouter } from "./app/routes/support.router";
import { UserRouter } from "./app/routes/user.router";
import { Logger } from "./app/services/logger.service";
import { SupportController } from "./app/controller/support.controller";
import { AccountBankController } from "./app/controller/accountBank.controller";
import { TokenValidation } from "./app/utils/verifytoken";
import { PaymentMethodController } from "./app/controller/paymentMethod.controller";
import { UserController } from "./app/controller/user.controller";
import SupportService from "./app/services/support.service";
import EmailService from "./app/services/emails.service";

const port = 3001;

export class Index {
  constructor(
    private authRouter: AuthRouter,
    private supportRouter: SupportRouter,
    private receipmentAccountRouter: ReceipmentAccountRouter,
    private paymentMethodRouter: PaymentMethodRouter,
    private userRouter: UserRouter
  ) {
    new App(
      this.authRouter,
      this.userRouter,
      this.receipmentAccountRouter,
      this.paymentMethodRouter,
      this.supportRouter
    ).server
      .listen(port, () => {
        Logger.infoLog(`Server running on port ${port}`);
      })
      .on("error", (err: any) => {
        Logger.errorLog(`Server error: ${err.message}`);
      });
  }
}

new Index(
  new AuthRouter(new AuthController()),
  new SupportRouter(new SupportController(), new TokenValidation()),
  new ReceipmentAccountRouter(new AccountBankController(), new TokenValidation()),
  new PaymentMethodRouter(new PaymentMethodController(), new TokenValidation()),
  new UserRouter(new UserController(), new TokenValidation())
);

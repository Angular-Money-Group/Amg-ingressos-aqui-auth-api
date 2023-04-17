import { App } from "./app";
import { AuthController } from "./app/controller/auth.controller";
import { AuthRouter } from "./app/routes/auth.router";
import { Logger } from "./app/services/logger.service";

const port = 3001;

const authController = new AuthController();
const authRouter = new AuthRouter(authController);

new App(authRouter).server
  .listen(port, () => {
    Logger.infoLog(`Server running on port ${port}`);
  })
  .on("error", (err: any) => {
    Logger.errorLog(`Server error: ${err.message}`);
  });

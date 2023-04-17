import { EmailService } from './app/services/emails.service';
import { AuthController } from './app/controller/auth.controller';
import { Logger } from './app/services/logger.service';
import { App } from "./app"
import { AuthRouter } from './app/routes/auth.router';

const port = 3001;

const authController = new AuthController()
const authRouter = new AuthRouter(authController);

new App(authRouter).server.listen(port, () => {
    Logger.infoLog(`Server running on port ${port}`);
}).on('error', (err) => {
    Logger.errorLog(`Server error: ${err.message}`);
});
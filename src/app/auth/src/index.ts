import { Logger } from './app/services/logger.service';
import { App } from "./app"

const port = 3001;

new App().server.listen(port, () => {
    Logger.infoLog(`Server running on port ${port}`);
}).on('error', (err) => {
    Logger.errorLog(`Server error: ${err.message}`);
});
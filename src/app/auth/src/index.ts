import { App } from "./app"

new App().server.listen(3002, () => {
    console.log("Server is running on port 3002");
});
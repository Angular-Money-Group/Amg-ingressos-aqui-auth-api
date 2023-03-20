import { App } from "./app"

new App().server.listen(3001, () => {
    console.log("Server is running on port 3003");
});
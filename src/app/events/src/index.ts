import { App } from "./app"

new App().server.listen(3003, () => {
    console.log("Server is running on port 3003");
});
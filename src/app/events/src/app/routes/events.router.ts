import express from "express";
import EventsController from "../controller/events.controller";


const eventRouter = express.Router();

eventRouter.get("/events/:id", EventsController.getEventById);
eventRouter.post("/events", EventsController.createEvent);
eventRouter.put("/events/:id", EventsController.updateEvent);
eventRouter.delete("/events/:id", EventsController.deleteEvent);


export default eventRouter;
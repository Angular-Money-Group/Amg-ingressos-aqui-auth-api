import { createEvent, deleteEvent, findEventById, getAllEvents } from './../controller/events.controller';
import { Router } from 'express';
import { authenticateToken, verifyTokenPermission } from './../utils/verifytoken';

const eventRouter = Router();

eventRouter.get('/getAllEvents', getAllEvents);
eventRouter.get('/getEventById/:id', authenticateToken, verifyTokenPermission, findEventById);
eventRouter.post('/createEvent', authenticateToken, verifyTokenPermission, createEvent);
eventRouter.put('/deleteEvent/:id', authenticateToken, verifyTokenPermission, deleteEvent);

export default eventRouter;
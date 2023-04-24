import { authenticateToken } from '../utils/verifytoken';
import { UserController } from './../controller/user.controller';
import { Router } from "express";

export class UserRouter {

    public userRouter: Router = Router()

    constructor(private userController: UserController){
        this.userRouter.put('/:id', authenticateToken, this.userController.updateUser)
    }

}
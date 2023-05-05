import { TokenValidation } from '../utils/verifytoken';
import { UserController } from './../controller/user.controller';
import { Router } from "express";

export class UserRouter {

    public userRouter: Router = Router()

    constructor(private userController: UserController, private tokenValidation: TokenValidation){
        this.userRouter.get('/', this.tokenValidation.verifyAdminPermission, this.userController.GetAllUsers)
        this.userRouter.put('/:id', this.tokenValidation.authenticateToken, this.userController.updateUser)
        this.userRouter.delete('/:id', this.tokenValidation.verifyAdminPermission, this.userController.deleteUser)
        this.userRouter.get("/getCustomer/:id", this.userController.findCustomerById);  
        this.userRouter.get("/getProducer/:id", this.userController.findProducerById);
    }

}
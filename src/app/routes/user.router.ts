import { TokenValidation } from '../utils/verifytoken';
import { UserController } from './../controller/user.controller';
import { Router } from "express";

export class UserRouter {

    public userRouter: Router = Router()

    constructor(private userController: UserController, private tokenValidation: TokenValidation){
        this.userRouter.get('/', this.tokenValidation.verifyAdminPermission, this.userController.GetAllUsers)
        this.userRouter.get("/getCustomer/:id", this.tokenValidation.verifyAdminPermission, this.userController.findCustomerById);  
        this.userRouter.get("/getTickets/:id", this.userController.getTicketsByUserID);  
        this.userRouter.get("/getColabsByProducer/:idProducer",  this.userController.getAllColabs);  
        this.userRouter.get("/getProducer/:id", this.userController.findProducerById);
        this.userRouter.put('/updateColab/:id', this.tokenValidation.verifyProducerPermission, this.userController.updateColab)
        this.userRouter.put('/:id', this.tokenValidation.authenticateToken, this.userController.updateUser)
        this.userRouter.delete("/deleteColab/:idProducer/:idColab", this.userController.deleteColab);
        this.userRouter.delete('/:id', this.tokenValidation.verifyAdminPermission, this.userController.deleteUser)
    }

}
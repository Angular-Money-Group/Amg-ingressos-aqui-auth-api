import { AccountBankController } from '../controller/accountBank.controller';
import { authenticateToken, verifyTokenPermission } from '../utils/verifytoken';
import { Router } from "express";

export class ReceipmentAccountRouter {

    public receipmentAccountRouter: Router = Router()

    constructor(private accountBankController: AccountBankController){
        this.receipmentAccountRouter.get('/:id', authenticateToken, verifyTokenPermission, this.accountBankController.getAccountReceipt)
        this.receipmentAccountRouter.post('/:id', authenticateToken, verifyTokenPermission, this.accountBankController.registerAccount)
        this.receipmentAccountRouter.delete('/:id/:userId', authenticateToken, verifyTokenPermission, this.accountBankController.deleteAccountReceipt)
    }

}
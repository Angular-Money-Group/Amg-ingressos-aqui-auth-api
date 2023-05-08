import { AccountBankController } from "../controller/accountBank.controller";
import { Router } from "express";
import { TokenValidation } from "../utils/verifytoken";

export class ReceipmentAccountRouter {
  public receipmentAccountRouter: Router = Router();

  constructor(
    private accountBankController: AccountBankController,
    private tokenValidation: TokenValidation
  ) {
    this.receipmentAccountRouter.get(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.accountBankController.getAccountReceipt
    );
    this.receipmentAccountRouter.post(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.accountBankController.registerAccount
    );
    this.receipmentAccountRouter.put(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.accountBankController.updateAccountReceipt
    );
    this.receipmentAccountRouter.delete(
      "/:id/:userId",
      this.tokenValidation.verifyProducerPermission,
      this.accountBankController.deleteAccountReceipt
    );
  }
}

import { PaymentMethodController } from "../controller/paymentMethod.controller";
import { Router } from "express";
import { TokenValidation } from "../utils/verifytoken";

export class PaymentMethodRouter {
  public paymentMethodRouter: Router = Router();

  constructor(
    private paymentMethodController: PaymentMethodController,
    private tokenValidation: TokenValidation
  ) {
    this.paymentMethodRouter.get(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.paymentMethodController.getPaymentMethods
    );
    this.paymentMethodRouter.post(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.paymentMethodController.registerPaymentMethod
    );
    this.paymentMethodRouter.put(
      "/:id",
      this.tokenValidation.verifyProducerPermission,
      this.paymentMethodController.updatePaymentMethods
    );
    this.paymentMethodRouter.delete(
      "/:id/:userId",
      this.tokenValidation.verifyProducerPermission,
      this.paymentMethodController.deletePaymentMethods
    );
  }
}

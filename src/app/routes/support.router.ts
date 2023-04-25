import { SupportController } from './../controller/support.controller';
import { Router } from "express";

export class SupportRouter {

    public supportRouter: Router = Router()

    constructor(private supportController: SupportController){
        this.supportRouter.post('/', this.supportController.sendEmailtoSupport)
    }

}
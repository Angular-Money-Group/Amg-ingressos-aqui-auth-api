import mongoose, { Model } from "mongoose";
import { OperationsDB } from "../db/operations.db";
import { Logger } from "../services/logger.service";
import { connection } from "../db/database";
import {mockCustomerModel, mockModel} from "../models/mock.model";


const mockProducer = {
  manager: "Test",
  corporateName: "Test",
  cnpj: "1234567890",
  email: "test@producer.test",
  password: "password",
  phoneNumber: "1234567890",
  createdAt: new Date(),
  isPhoneVerified: false,
  isEmailVerified: false,
};

describe("OperationsDB", () => {
  beforeEach(async () => {
    await connection();
  });

  afterEach(async () => {
    await deleteMocks();
  });

});

export async function deleteMocks() {
  await OperationsDB.getAll(mockModel).then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      await mockModel.findByIdAndDelete(result[i].id)
    }
  });

  await OperationsDB.getAll(mockCustomerModel).then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      await mockModel.findByIdAndDelete(result[i].id)
    }
  });
}

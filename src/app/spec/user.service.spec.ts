import dotenv from "dotenv";
import { connection } from "../db/database";
import { OperationsDB } from "../db/operations.db";
import customerModel from "../models/customer.model";
import producerModel from "../models/producer.models";
import { mockCustomerModel, mockModel } from "../models/mock.model";
import UserService from "../services/user.service";
import { deleteMocks } from "./operations.db.spec";

jest.mock("jsonwebtoken");

dotenv.config();

describe("AuthService", () => {
  const mockCustomer = {
    id: "1234567890",
    name: "Test",
    email: "test@example.com",
    password: "password",
    isPhoneVerified: false,
    isEmailVerified: false,
    phoneNumber: "1234567890",
    cpf: "1234567890",
  };

  const mockProducer = {
    id: "1234567891",
    manager: "Test",
    corporateName: "Test",
    cnpj: "1234567891",
    email: "test@producer.test",
    password: "password",
    phoneNumber: "1234567890",
    isPhoneVerified: false,
    isEmailVerified: false,
  };

  beforeAll(async () => {
    await connection();
    await mockCustomerModel.create(mockCustomer);
    await mockModel.create(mockProducer);
  });

  afterAll(async () => {
    await deleteMocks();
  });

  describe("findCustomerById", () => {
    it("should find Customer sucess", async () => {
      const spyOperationsDB = jest
        .spyOn(OperationsDB, "getById")
        .mockResolvedValueOnce(mockCustomer);

      const result = await UserService.findUser("1234567890", customerModel);

      expect(result).toEqual(mockCustomer);
      expect(spyOperationsDB).toHaveBeenCalledWith(
        "1234567890",
        customerModel
      );
    });

    it("should reject with an error when findUser fails", async () => {
      // Mock the findById function to reject with an error
      const mockFindById = jest.spyOn(OperationsDB, "getById");
      mockFindById.mockRejectedValueOnce(
        new Error("Could not find customer")
      );

      try {
        // Call the function with an email value
        await UserService.findUser("1234567", customerModel);
    
        // If the function does not throw an error, the test should fail
        throw new Error("Expected function to throw an error");
      } catch (error) {
        // Expect that the error message matches the expected message
        expect(error.message).toBe("Could not find customer");
        // Expect that the findById function was called with the correct value
        expect(mockFindById).toHaveBeenCalledWith("1234567", customerModel);
      }
    });
  });

  describe("findProducerById", () => {
    it("should find Producer sucess", async () => {
      const spyOperationsDB = jest
        .spyOn(OperationsDB, "getById")
        .mockResolvedValueOnce(mockProducer);

      const result = await UserService.findUser("1234567891", producerModel);

      expect(result).toEqual(mockProducer);
      expect(spyOperationsDB).toHaveBeenCalledWith(
        "1234567891",
        producerModel
      );
    });

    it("should reject with an error when findUser fails", async () => {
      // Mock the findById function to reject with an error
      const mockFindById = jest.spyOn(OperationsDB, "getById");
      mockFindById.mockRejectedValueOnce(
        new Error("Could not find Producer")
      );

      try {
        // Call the function with an email value
        await UserService.findUser("1234567", producerModel);
    
        // If the function does not throw an error, the test should fail
        throw new Error("Expected function to throw an error");
      } catch (error) {
        // Expect that the error message matches the expected message
        expect(error.message).toBe("Could not find Producer");
        // Expect that the findById function was called with the correct value
        expect(mockFindById).toHaveBeenCalledWith("1234567", producerModel);
      }
    });
  });
});

import dotenv from "dotenv";
import { connection } from "../db/database";
import { OperationsDB } from "../db/operations.db";
import customerModel from "../models/customer.model";
import { mockCustomerModel, mockModel } from "../models/mock.model";
import { AuthService } from "../services/auth.service";
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
    manager: "Test",
    corporateName: "Test",
    cnpj: "1234567890",
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

  describe("findCustomerByEmail", () => {
    it("should find Email sucess", async () => {
      const spyOperationsDB = jest
        .spyOn(OperationsDB, "findByEmail")
        .mockResolvedValueOnce(mockCustomer);

      const result = await AuthService.findCustomerByEmail("test@example.com");

      expect(result).toEqual(mockCustomer);
      expect(spyOperationsDB).toHaveBeenCalledWith(
        "test@example.com",
        customerModel
      );
    });

    it("should reject with an error when findByEmail fails", async () => {
      // Mock the findByEmail function to reject with an error
      const mockFindByEmail = jest.spyOn(OperationsDB, "findByEmail");
      mockFindByEmail.mockRejectedValueOnce(
        new Error("Could not find customer")
      );

      // Call the function with an email value
      await expect(
        AuthService.findCustomerByEmail("john.doe@example.com")
      ).rejects.toThrow("Could not find customer");

      // Expect that the findByEmail function was called with the correct value
      expect(mockFindByEmail).toHaveBeenCalledWith(
        "john.doe@example.com",
        customerModel
      );
    });
  });

  describe("findProducerByEmail", () => {
    it("should find Email sucess", async () => {
      const spyOperationsDB = jest
        .spyOn(OperationsDB, "findByEmail")
        .mockResolvedValueOnce(mockCustomer);

      const result = await AuthService.findCustomerByEmail("test@example.com");

      expect(result).toEqual(mockCustomer);
      expect(spyOperationsDB).toHaveBeenCalledWith(
        "test@example.com",
        customerModel
      );
    });

    it("should reject with an error when findByEmail fails", async () => {
      // Mock the findByEmail function to reject with an error
      const mockFindByEmail = jest.spyOn(OperationsDB, "findByEmail");
      mockFindByEmail.mockRejectedValueOnce(
        new Error("Could not find customer")
      );

      // Call the function with an email value
      await expect(
        AuthService.findCustomerByEmail("john.doe@example.com")
      ).rejects.toThrow("Could not find customer");

      // Expect that the findByEmail function was called with the correct value
      expect(mockFindByEmail).toHaveBeenCalledWith(
        "john.doe@example.com",
        customerModel
      );
    });
  });



});

import mongoose from "mongoose";

export const mockModel = mongoose.model(
  "MockModel",
  new mongoose.Schema({
    manager: { type: String, required: true },
    cnpj: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    corporateName: { type: String, required: true },
    isPhoneVerified: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    eventsCreated: { type: mongoose.Schema.Types.ObjectId, ref: "MockEvent" },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  })
);

export const mockCustomerModel = mongoose.model(
  "mockCustomerModel",
  new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isPhoneVerified: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, required: true },
  })
);

export const mockEventModel = mongoose.model(
  "MockEvent",
  new mongoose.Schema({
    name: { type: String, required: true },
    local: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    cep: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: true },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    referencePoint: { type: String, required: true },
  })
);

export default {mockModel, mockCustomerModel, mockEventModel};

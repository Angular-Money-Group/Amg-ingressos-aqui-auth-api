import mongoose from "mongoose";

const customerModel = new mongoose.Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cep: { type: String },
  address: { type: String },
  houseNumber: { type: String },
  complement: { type: String },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  isPhoneVerified: { type: Boolean, required: true, default: false },
  isEmailVerified: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: true },
  emailConfirmationCode: {
    code: { type: String },
    expirationDate: { type: Date },
  },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tickets" }],
  paymentMethods: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
  ],
});

export default mongoose.model("Customer", customerModel);

export interface CustomerType {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  password: string | undefined;
  phoneNumber: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  cep?: string;
  address?: string;
  houseNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  emailConfirmationCode?: {
    code?: string;
    expirationDate?: Date;
  };
  tickets?: string[];
  paymentMethods?: string[];
}

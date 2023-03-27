import mongoose from "mongoose";

const customerModel = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isPhoneVerified: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, required: true },
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
}

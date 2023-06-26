import mongoose, { Document } from "mongoose";

const producerModel = new mongoose.Schema({
  name: { type: String, required: true },
  cnpj: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  corporateName: { type: String, required: true },
  cep: { type: String },
  address: { type: String },
  houseNumber: { type: String },
  complement: { type: String },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  emailConfirmationCode: {
    code: { type: String, default: null },
    expirationDate: { type: Date, default: null },
  },
  isPhoneVerified: { type: Boolean, required: true, default: false },
  isEmailVerified: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: true },
  myTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tickets" }],
  colabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Colab" }],
  eventsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  receiptAccounts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ReceiptAccounts" },
  ],
});

export default mongoose.model("Producer", producerModel);

export interface ProducerType extends Document {
  id?: string;
  name: string;
  cnpj: string;
  email: string;
  password: string;
  phoneNumber: string;
  corporateName: string;
  cep?: string;
  address?: string;
  houseNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  emailConfirmationCode?: {
    code: string | null;
    expirationDate: Date | null;
  };
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  myTickets?: Array<string>;
  colabs?: Array<string>;
  eventsCreated?: Array<string>;
  receiptAccounts?: Array<string>;
}

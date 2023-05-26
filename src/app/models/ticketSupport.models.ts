import mongoose from "mongoose";

const ticketSupportSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  subject: { type: String, required: true },
  createAt: { type: Date, default: Date.now() },
  state: { type: String, required: true, default: "Ativo" },
});

export default mongoose.model("TicketSupport", ticketSupportSchema);


export interface TicketSupport {
    email: string,
    message: string,
    phoneNumber: string,
    subject: string,
}
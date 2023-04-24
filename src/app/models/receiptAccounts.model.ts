import mongoose from "mongoose";

const receiptAccountsModel = new mongoose.Schema({
    cnpj: { type: String, required: true },
    fullName: { type: String, required: true },
    bank: { type: String, required: true },
    bankAgency: { type: String, required: true },
    bankAccount: { type: String, required: true },
    bankDigit: { type: String, required: true },
});

export default mongoose.model("ReceiptAccounts", receiptAccountsModel);
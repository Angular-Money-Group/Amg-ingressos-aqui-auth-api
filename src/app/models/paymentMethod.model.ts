import mongoose from "mongoose";

const paymentMethodModel = new mongoose.Schema({
    typePayment: { type: String, required: true },
    cardNumber: { type: String },
    holder: { type: String },
    expirationDate: { type: String },
    securityCode: { type: String },
    saveCard: { type: Boolean },
    brand: { type: String },
    installments: { type: Number },
    nickname: { type: String },
});

export default mongoose.model("PaymentMethod", paymentMethodModel);
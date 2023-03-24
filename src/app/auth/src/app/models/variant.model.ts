import mongoose, { Document } from 'mongoose';

const variantModel = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
});

export default mongoose.model('Variant', variantModel);

export interface VariantType extends Document {
    name: string;
    price: number;
    quantity: number;
    start: string;
    end: string;
  }
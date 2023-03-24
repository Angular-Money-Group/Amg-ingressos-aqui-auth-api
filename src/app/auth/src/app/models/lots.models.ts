import { VariantType } from "./variant.model";
import mongoose, { Document } from "mongoose";

const lotsModel = new mongoose.Schema({
    description: { type: String, required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
    sellTicketsBeforeStartAnother: { type: Boolean, required: true },
    sellTicketsInAnotherBatch: { type: Boolean, required: true },
});

export default mongoose.model<LotsType>("Lots", lotsModel);

export interface LotsType extends Document {
    description: string;
    variant: VariantType[];
    sellTicketsBeforeStartAnother: boolean;
    sellTicketsInAnotherBatch: boolean;
  }
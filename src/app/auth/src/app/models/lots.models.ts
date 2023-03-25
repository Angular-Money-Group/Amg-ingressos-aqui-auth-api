import { VariantType } from "./variant.model";
import mongoose, { Document } from "mongoose";

const lotsModel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
    sellTicketsBeforeStartAnother: { type: Boolean, required: true },
    sellTicketsInAnotherBatch: { type: Boolean, required: true },
});

export default mongoose.model<LotsType>("Lots", lotsModel);

export interface LotsType {
    name: string;
    description: string;
    variant: VariantType[];
    sellTicketsBeforeStartAnother: boolean;
    sellTicketsInAnotherBatch: boolean;
  }
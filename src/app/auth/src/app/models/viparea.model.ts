import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";
import { TicketsAreas } from "./ticketsArea.models";

dotenv.config();

const vipAreaModel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    personPerArea: { type: Number, required: true },
    ticketsAreas: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketsAreas' },
    start: { type: String, required: true },
    end: { type: String, required: true },
});

export default mongoose.model<VIPAreaType>("VIPArea", vipAreaModel);

export interface VIPAreaType extends Document {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    personPerArea: number;
    ticketsAreas: TicketsAreas[];
    start: string;
    end: string;
  }
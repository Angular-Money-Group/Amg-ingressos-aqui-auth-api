import mongoose from "mongoose";

const ticketsAreasModel = new mongoose.Schema({
    id: { type: Number, required: true },
    position: { type: Number, required: true },
    quantityAvaible: { type: Number, required: true },
    isReserved: { type: Boolean, required: true },
    isSold: { type: Boolean, required: true },
});

export default mongoose.model("TicketsAreas", ticketsAreasModel);

export interface TicketsAreas {
    id: string;
    position: number;
    quantityAvaible: number;
    isReserved: boolean;
    isSold: boolean;
  }
  
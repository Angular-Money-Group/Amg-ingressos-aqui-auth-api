import mongoose from "mongoose";

const ticketsAreasModel = new mongoose.Schema({
    position: { type: Number, required: true },
    isReserved: { type: Boolean, required: true },
    isSold: { type: Boolean, required: true },
});

export default mongoose.model("TicketsAreas", ticketsAreasModel);

export class TicketsAreas {
    position?: number;
    isReserved?: boolean;
    isSold?: boolean;
  }
  
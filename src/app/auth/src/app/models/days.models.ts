import mongoose, { Document } from "mongoose";

const daysModel = new mongoose.Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
});

export default mongoose.model<DaysType>("Days", daysModel);

export interface DaysType extends Document{
    start: string;
    end: string;
  }
  
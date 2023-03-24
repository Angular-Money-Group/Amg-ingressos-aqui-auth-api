import mongoose, { Document } from "mongoose";

const daysModel = new mongoose.Schema({
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
});

export default mongoose.model<DaysType>("Days", daysModel);

export interface DaysType extends Document{
    day: string;
    start: string;
    end: string;
  }
  
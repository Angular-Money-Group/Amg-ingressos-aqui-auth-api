import mongoose, { Document } from "mongoose";

const daysModel = new mongoose.Schema({
    start: { type: Date },
    end: { type: Date },
});

export default mongoose.model<DaysType>("Days", daysModel);

export interface DaysType extends Document{
    start: Date;
    end: Date;
  }
  
import mongoose, { Document } from "mongoose";

const eventModel = new mongoose.Schema({
  name: { type: String, required: true },
  local: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  cep: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String, required: true },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  referencePoint: { type: String, required: true },
  days: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Days' }],
  lots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lots' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: Number, required: true },
  idMeansReceipt: { type: mongoose.Schema.Types.ObjectId, ref: 'Receiptaccounts', default: null },
  idOrganizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producers', required: true },
  highlighted: { type: Boolean, default: false },
  colabs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colabs' }]
});

export default mongoose.model<EventType>("Event", eventModel);

export interface EventType extends Document {
  name: string;
  local: string;
  type: string;
  image: string;
  description: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  referencePoint: string;
  days: string[]; // Assuming it's an array of string IDs
  lots: string[]; // Assuming it's an array of string IDs
  startDate: Date;
  endDate: Date;
  status: number;
  idMeansReceipt: string | null; // Assuming it's a string ID or null
  idOrganizer: string; // Assuming it's a string ID
  highlighted: boolean;
  colabs: string[]; // Assuming it's an array of string IDs
}


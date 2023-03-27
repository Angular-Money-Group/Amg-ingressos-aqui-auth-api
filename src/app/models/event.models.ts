import mongoose, { Document } from "mongoose";
import { VIPAreaType } from "./viparea.model";
import { DaysType } from "./days.models";
import { LotsType } from "./lots.models";

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
  VIPArea: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VIPArea' }],
});

export default mongoose.model<EventType>("Event", eventModel);

export interface EventType extends Document {
  id?: string;
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
  days: DaysType[];
  lots: LotsType[];
  VIPArea: VIPAreaType[];
}

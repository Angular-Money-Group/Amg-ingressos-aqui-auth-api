import mongoose, { Document } from "mongoose";

const colabModel = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    events: { type: mongoose.Schema.Types.ObjectId, ref: 'Events' },
});

export default mongoose.model<ColabType>("Colab", colabModel);

export interface ColabType {
    name: string;
    cpf: string;
    email: string;
    password: string;
    events?: EventColab[];
  }

export interface EventColab{
    eventId: string;
    DataInicio: Date;
    DataFim: Date;
    qtdLeitura: number
}
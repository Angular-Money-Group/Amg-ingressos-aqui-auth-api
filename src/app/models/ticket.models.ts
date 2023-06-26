import mongoose from 'mongoose';

export interface TicketDocument {
  _id: string;
  idLot?: string;
  idUser?: string;
  position?: string;
  value: number;
  isSold: boolean;
  reqDocs: boolean;
  qrCode: string;
}

const ticketModel = new mongoose.Schema({
  idLot: { type: String },
  idUser: { type: String },
  position: { type: String },
  value: { type: Number, required: true },
  isSold: { type: Boolean, default: false },
  reqDocs: { type: Boolean, required: true },
  qrCode: { type: String, required: true }
});

export default mongoose.model('Tickets', ticketModel);

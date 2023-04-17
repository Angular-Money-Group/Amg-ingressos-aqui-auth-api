import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Logger } from '../services/logger.service';

dotenv.config();

export const connection = async () => {
   await mongoose
    .connect(process.env.DB_CONNECTION!)
    .then(() => Logger.infoLog("Conectado ao MongoDB"))
    .catch((err) => Logger.errorLog("Erro ao conectar ao MongoDB: " + err));
}

export default { connection };
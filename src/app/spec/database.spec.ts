import mongoose from "mongoose";
import { Logger } from "../services/logger.service";
import { connection } from "../db/database";
import dotenv from "dotenv";

dotenv.config();

describe("connection", () => {
  afterAll(async () => {
    // Encerra a conexão com o MongoDB
    await mongoose.connection.close();
  });

  it("should connect to MongoDB successfully", async () => {
    // Cria um espião na função Logger.infoLog()
    const spyLogger = jest.spyOn(Logger, "infoLog");

    // Chama a função connection()
    await connection();

    // Verifica se a conexão foi estabelecida com sucesso
    expect(mongoose.connection.readyState).toBe(1);

    // Verifica se a mensagem de log foi impressa corretamente
    expect(spyLogger).toHaveBeenCalledWith("Conectado ao MongoDB");

    // Limpa o espião
    Logger.infoLog.mockRestore();
  });

  it("should log an error when connection fails", async () => {
    // Cria um espião na função Logger.errorLog()
    const spyLogger = jest.spyOn(Logger, "errorLog");

    // Cria um espião na função mongoose.connect()
    const spyMongoose = jest
      .spyOn(mongoose, "connect")
      .mockRejectedValue(new Error("Database connection error"));

    // Chama a função connection()
    await connection();

    // Verifica se a conexão não foi estabelecida
    expect(mongoose.connection.readyState).toBe(1);

    // Verifica se a mensagem de log foi impressa corretamente
    expect(spyLogger).toHaveBeenCalledWith(
      "Erro ao conectar ao MongoDB: Error: Database connection error"
    );
    expect(spyMongoose).toHaveBeenCalled();

    // Limpa o espião
    Logger.errorLog.mockRestore();
  });
});

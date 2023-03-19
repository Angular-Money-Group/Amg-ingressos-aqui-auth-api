import { Request, Response } from "express";
import { query } from "../db/database";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      local,
      type,
      image,
      description,
      cep,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      referencePoint,
      producerId,
      days,
      lots,
    } = req.body;

    const resultLots = await query("INSERT INTO lot SET ?", lots);
    const resultDays = await query("INSERT INTO days SET ?", days);



    const newEvent = {
      daysId: resultDays.insertId,
      lotsId: resultLots.insertId,
      producerId,
      name,
      local,
      type,
      image,
      description,
      cep,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      referencePoint,
    };

    const result = await query("INSERT INTO events SET ?", newEvent);

    return res.status(201).json({ message: "Evento criado com sucesso", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query("SELECT * FROM events JOIN days ON events.daysId = days.id JOIN lot ON events.lotsId = lot.id WHERE events.id = ?", [id]);

        return res.status(200).json({message: "Operação realizada com sucesso", data: result});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const {
            name,
            local,
            type,
            image,
            description,
            cep,
            address,
            number,
            complement,
            neighborhood,
            city,
            state,
            referencePoint,
            days,
            lots,
          } = req.body;

        const eventUpdade = {
            name,
            local,
            type,
            image,
            description,
            cep,
            address,
            number,
            complement,
            neighborhood,
            city,
            state,
            referencePoint,
        }
        
        await query("UPDATE lot SET ? WHERE id = ?", [lots, lots.id]);
        await query("UPDATE days SET ? WHERE id = ?", [days, days.id]);
        await query("UPDATE events SET ? WHERE id = ?", [eventUpdade, id]);

        const result = await query("SELECT * FROM events WHERE id = ?", [id]);

        return res.status(200).json({ message: "Evento atualizado com sucesso", result });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await query("DELETE FROM events WHERE id = ?", [id]);
        return res.status(200).json({ message: "Evento deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getEventsByProducerId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query("SELECT * FROM events WHERE producerId = ?", [id]);
        return res.status(200).json({message: "Operação realizada com sucesso", data: result});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default { createEvent, getEventById, updateEvent, deleteEvent, getEventsByProducerId };
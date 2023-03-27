import { Response } from 'express';
import { Logger } from '../services/logger.service';

export const successResponse = (res: Response, data: any) => {
    return res.status(200).json({ message: 'Operação Realizada com sucesso', data });
}

export const createdResponse = (res: Response, data: any, object: string) => {
    return res.status(201).json({ message: `${object} creado com sucesso`, data });
}

export const badRequestResponse = (res: Response) => {
    return res.status(400).json({ message: "Não foi possivel realizar essa ação" });
}

export const unauthorizedResponse = (res: Response) => {
    return res.status(401).json({ message: 'Você não tem permissão de acessar esse conteúdo' });
}

export const forbiddenResponse = (res: Response) => {
    return res.status(403).json({ message: 'Você não tem permissão de acessar esse conteúdo' });
}

export const notFoundResponse = (res: Response) => {
    return res.status(404).json({ message: 'Não foi possivel encontrar o recurso solicitado' });
}

export const unprocessableEntityResponse = (res: Response) => {
    return res.status(422).json({ message: "Ah não! Parece que você não preencheu todos os campos" });
}

export const internalServerErrorResponse = (res: Response, error: any) => {
    return res.status(500).json({ message: 'Ops! Algo deu errado, tente novamente mais tarde', error})
}

export const serviceUnavailableResponse = (res: Response) => {
    return res.status(503).json({ message: 'Ops! Algo deu errado, tente novamente mais tarde' });
}
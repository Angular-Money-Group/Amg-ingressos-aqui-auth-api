import { Response } from 'express';
import { Logger } from '../services/logger.service';

export const successResponse = (res: Response, data: any) => {
    return res.status(200).json({ message: 'Operação Realizada com sucesso', data });
}

export const createdResponse = (res: Response, data: any, object: string) => {
    return res.status(201).json({ message: `${object} criado com sucesso`, data });
}

export const noContentResponse = (res: Response) => {
    return res.status(204).json({});
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

export const eventNotFound = (res: Response) => {
    return res.status(404).json({ message: 'Evento não encontrado' });
}

export const userNotFound = (res: Response) => {
    return res.status(404).json({ message: 'Usuário e/ou senha incorreto(s)' });
}

export const invalidPassword = (res: Response) => {
    return res.status(404).json({ message: 'Usuário e/ou senha incorreto(s)' });
}

export const emailAlreadyExists = (res: Response) => {
    return res.status(404).json({ message: 'Este email já está cadastrado' });
}

export const failToRegister = (res: Response) => {
    return res.status(404).json({ message: 'Erro ao cadastrar usuário, tente novamente em alguns segundos...' });
}

export const failedToUpdatePassword = (res: Response) => {
    return res.status(404).json({ message: 'Erro ao atualizar senha' });
}

export const invalidEmailFormat = (res: Response) => {
    return res.status(404).json({ message: 'Formato de email não suportado' });
}

export const logoutError = (res: Response) => {
    return res.status(404).json({ message: 'Falha ao tentar fazer Logout' });
}

export const emailNotConfirmed = (res: Response) => {
    return res.status(404).json({ message: 'Parece que seu Email ainda não foi verificado... Verifique seu email para dar continuidade' });
}

export const sessionExpired = (res: Response) => {
    return res.status(404).json({ message: 'Sua sessão expirou... Faça login novamente para continuar.' });
}

export const modelNotFound = (res: Response) => {
    return res.status(404).json({ message: 'userType não é igual a Producer ou Customer' });
}

export const invalidPayment = (res: Response) => {
    return res.status(404).json({ message: 'Forma de pagamento inválida' });
}

export const unprocessableEntityResponse = (res: Response, data?: any) => {
    return res.status(422).json({ message: "Ah não! Parece que você não preencheu todos os campos", data });
}

export const internalServerErrorResponse = (res: Response, error: any) => {
    return res.status(500).json({ message: 'Ops! Algo deu errado, tente novamente mais tarde', error})
}

export const serviceUnavailableResponse = (res: Response) => {
    return res.status(503).json({ message: 'Ops! Algo deu errado, tente novamente mais tarde' });
}
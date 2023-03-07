import { Request, Response } from "express";
import { query } from "../db/database";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/autenticateToken.utils";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Ah não! Parece que você não preencheu todos os campos",
    });
  }

  try {
    const customers = await query("SELECT * FROM customers WHERE email=?", [
      email,
    ]);
    const producers = await query("SELECT * FROM producers WHERE email=?", [
      email,
    ]);

    if (customers.length === 0 && producers.length === 0) {
      return res.status(400).json({
        message: "Não foi possivel logar",
      });
    }

    if (producers.length > 0) {
      const isMatch = await bcrypt.compare(password, producers[0].password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Credenciais inválidas",
        });
      }

      delete producers[0].password;

      const { accessToken, refreshToken } = generateTokens(producers);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });

      return res.status(200).json({ accessToken });
    } else if (customers.length > 0) {
      const isMatch = await bcrypt.compare(password, customers[0].password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Credenciais inválidas",
        });
      }

      delete customers[0].password;

      const { accessToken, refreshToken } = generateTokens(customers);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });

      return res.status(200).json({ accessToken });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const refreshTokenReq = refreshToken;

  try {
    const { accessToken, refreshToken } = generateTokens(refreshTokenReq);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logout successfully" });
};

export const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, cpf, phoneNumber, password } = req.body;

  if (!name || !email || !cpf || !phoneNumber || !password) {
    return res.status(400).json({
      message: "Ah não! Parece que você não preencheu todos os campos",
    });
  }

  try {
    const user = await query("SELECT * FROM customers WHERE email=?", [email]);
    const producer = await query("SELECT * FROM producers WHERE email=?", [
      email,
    ]);

    if (user.length > 0 || producer.length > 0) {
      return res.status(400).json({
        message: "Não foi Possivel cadastrar o usuário",
      });
    }

    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      cpf,
      phoneNumber,
      password: hash,
      createdAt: new Date(),
    };

    const result = await query("INSERT INTO customers SET ?", [newUser]);

    if (result.affectedRows === 1) {
      const { accessToken, refreshToken } = generateTokens(newUser);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });

      return res.status(200).json({ accessToken });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const registerProducer = async (req: Request, res: Response) => {
  const { manager, email, cnpj, phoneNumber, corporateName, password } =
    req.body;

  try {
    if (
      !manager ||
      !email ||
      !cnpj ||
      !phoneNumber ||
      !corporateName ||
      !password
    ) {
      return res.status(400).json({
        message: "Ah não! Parece que você não preencheu todos os campos",
      });
    }

    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(password, salt);

    const newUser = {
      manager,
      email,
      cnpj,
      phoneNumber,
      corporateName,
      password: hash,
      createdAt: new Date(),
    };

    const result = await query("INSERT INTO producers SET ?", [newUser]);

    if (result.affectedRows === 1) {
      const { accessToken, refreshToken } = generateTokens(newUser);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // tempo de vida de 7 dias
      });

      return res.status(200).json({ accessToken });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await query("SELECT * FROM customers WHERE id=?", [id]);
        const producer = await query("SELECT * FROM producers WHERE id=?", [id]);

        if (user.length > 0) {
            return res.status(200).json(user[0]);
        } else if (producer.length > 0) {
            return res.status(200).json(producer[0]);
        } else {
            return res.status(404).json({
                message: "Usuário não encontrado",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};


export default { login, refreshToken, logout, registerCustomer, registerProducer, getUser };

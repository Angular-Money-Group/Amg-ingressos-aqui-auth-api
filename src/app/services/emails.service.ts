import dotenv from "dotenv";
import { Model } from "mongoose";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { OperationsDB } from "../db/operations.db";
import { Logger } from "./logger.service";

dotenv.config();

interface EmailConfirmationCode {
  code: string;
  expirationDate: Date;
}

interface InfoEmail {
  id: string;
  email: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    Logger.infoLog("Create transport email");
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
  }

  public async sendEmailToConfirmationAccount<M extends Model<any>>(
    infoEmail: InfoEmail,
    UserModel: M
  ) {
    Logger.infoLog("Deleting email code validation");
    await OperationsDB.updateItems(
      infoEmail.id,
      {
        emailConfirmationCode: {
          code: null,
          expirationDate: null,
        },
      },
      UserModel
    );

    Logger.infoLog("Getting email code validation");
    const confirmationCode = await this.generateRandomCode();

    Logger.infoLog("Generation HTML");
    const html = `
        <html>
          <body>
            <h1>Confirmação de E-mail</h1>
            <p>Seu código de confirmação é:</p>
            <h2>${confirmationCode}</h2>
            <p>Por favor, insira este código em nosso site para confirmar seu e-mail, ele expira em 15 minutos.</p>
          </body>
        </html>
      `;

    Logger.infoLog("Creating Options to email send");

    Logger.log(infoEmail.email);
    const options: SendMailOptions = {
      from: process.env.EMAIL_EMAIL,
      to: infoEmail.email,
      subject: "Confirmação de E-mail",
      html: html,
    };

    let data = new Date();
    data.setMinutes(data.getMinutes() + 15);

    Logger.infoLog("Montando objeto para salvar o codigo de verificação");
    const emailConfirmationCode: EmailConfirmationCode = {
      code: confirmationCode,
      expirationDate: data,
    };

    Logger.infoLog(
      `Objeto criado com sucesso: ${JSON.parse(
        JSON.stringify(emailConfirmationCode)
      )}`
    );

    try {
      Logger.infoLog("Enviando email");
      this.transporter
        .sendMail(options)
        .then(() => {
          Logger.infoLog("Email enviado, salvando codigo do usuário");
          this.saveCodeOnDatabase(
            infoEmail.id,
            emailConfirmationCode,
            UserModel
          )
            .then(() => {
              Logger.infoLog("Código salvo com sucesso");
            })
            .catch((err) => {
              Logger.errorLog("Código não salvo: " + err);
            });
        })
        .catch((err) => {
          Logger.errorLog("Código não enviado: " + err);
        });
    } catch (error) {
      Logger.fatalLog("Código não salvo: " + error);
    }
  }

  private async saveCodeOnDatabase<M extends Model<any>>(
    id: string,
    emailConfirmationCode: EmailConfirmationCode,
    UserModel: M
  ): Promise<any> {
    return await OperationsDB.updateItems(
      id,
      { emailConfirmationCode },
      UserModel
    );
  }

  private async generateRandomCode() {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += digits[Math.floor(Math.random() * 10)];
    }

    Logger.infoLog(code);
    return code;
  }

  public async confirmationEmail<M extends Model<any>>(
    userId: string,
    code: string,
    model: M
  ) {
    try {
      const user = await OperationsDB.getById(userId, model);

      if (user.emailConfirmationCode.expirationDate < new Date()) {
        return Promise.reject("Code expiration");
      } else if (user.emailConfirmationCode.code != code) {
        return Promise.reject("Code invalid");
      } else {
        await OperationsDB.updateItems(
          userId,
          {
            emailConfirmationCode: {
              code: null,
              expirationDate: null,
            },
            isEmailVerified: true,
          },
          model
        );

        return Promise.resolve();
      }
    } catch (err: any) {
      Promise.reject(err);
    }
  }
}

export default EmailService;

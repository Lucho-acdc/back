import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendResetPasswordEmail = (to, token) => {
  const resetLink = `http://localhost:8080/api/session/resetPassword?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Restablecimiento de Contraseña',
    html: `
      <h1>Restablecimiento de Contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer Contraseña</a>
      <p>El enlace expira en 1 hora.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

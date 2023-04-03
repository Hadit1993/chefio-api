import nodemailer from "nodemailer";
import { EMAIL_ADDRESS, EMAIL_PASSWORD } from "../constants/env";
import { VerificationType } from "../generalTypes";

export default function sendEmail(
  recipientEmail: string,
  type: VerificationType,
  verificationCode: number
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: recipientEmail,
    subject: "Chefio Activation Email",
    html:
      type === "account-activation"
        ? generateHtmlForAccountActivation(verificationCode)
        : generateHtmlForPasswordRecovery(verificationCode),
  };

  return transporter.sendMail(mailOptions);
}

function generateHtmlForAccountActivation(verificationCode: number) {
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>Chefio Activation Email</title>
      </head>
      <body>
        <h1>Welcome to Chefio!</h1>
        <p>Thank you for signing up with Chefio. To activate your account, please use the following activation code:</p>
        <p><strong>${verificationCode}</strong></p>
        <p>Thank you for choosing Chefio!</p>
      </body>
    </html>`;
}

function generateHtmlForPasswordRecovery(verificationCode: number) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Chefio Password Recovery</title>
  </head>
  <body>
    <h1>Chefio Password Recovery</h1>
    <p>We have received a request to reset your password. Please use the following activation code to reset your password:</p>
    <p><strong>${verificationCode}</strong></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you for using Chefio.</p>
    <p>Best regards,</p>
    <p>The Chefio Team</p>
  </body>
</html>
`;
}

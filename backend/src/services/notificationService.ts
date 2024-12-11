import nodemailer from 'nodemailer';
import twilio from 'twilio';

const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const smsClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmail = async (to: string, subject: string, text: string) => {
  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export const sendSMS = async (to: string, message: string) => {
  await smsClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message,
  });
};

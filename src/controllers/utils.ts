import {Request} from 'express';
import {verify} from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

export const checkSuperUser = async req => {
  try {
    const token = req.headers['x-access-token'];

    const decoded = verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'super') throw new Error('Not enough privilegies');

    return decoded;
  } catch (e) {
    throw new Error(e);
  }
};

export const checkInviteToken = async (req: Request) => {
  try {
    const token = req.headers['x-access-token'] as string;

    const decoded = verify(token, process.env.JWT_SECRET as string);

    return decoded;
  } catch (e) {
    throw new Error('Token error');
  }
};

export const sendEmail = async (
  email: string,
  subject: string,
  body: string
): Promise<string | void> => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SENDER_SERVICE,
    auth: {
      user: process.env.EMAIL_SENDER_ADDRESS,
      pass: process.env.EMAIL_SENDER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER_ADDRESS, // sender address
    to: email, // receiver' (use array of string for a list)
    subject: subject, // Subject line
    html: body, // plain text body
  };

  return await transporter
    .sendMail(mailOptions)
    .then((info: {accepted: string}) => {
      return 'Email sent to ' + info.accepted;
    })
    .catch((error: string | undefined) => {
      throw new Error(error);
    });
};

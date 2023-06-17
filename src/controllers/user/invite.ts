import * as nodemailer from 'nodemailer';
import {sign} from 'jsonwebtoken';
import Company from '../../models/company';
import {Request, Response} from 'express';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const company = (await Company.find(1))[0];

  // TODO - bind user to user through email sent

  // TODO - find a way to pass a token in a url link

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mateu.xa@gmail.com',
      pass: 'oguzgabgcdcbjndf',
    },
  });

  const token = sign(
    {
      companyId: company.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    }
  );

  const mailOptions = {
    from: 'mateu.xa@gmail.com', // sender address
    to: 'jecirin709@ukbob.com', // receiver' (use array of string for a list)
    subject: 'Subject of your email', // Subject line
    html: `
            <div>
                <h1>You have been invited to ${company?.name}</h1>
                <a href='http://localhost:3000/user/invite/${token}'>Click here!</a>
            </div>
        `, // plain text body
  };

  let data;

  transporter.sendMail(mailOptions, (err: any, info: any) => {
    if (err) {
      console.log(err);
    } else {
      data = info;
    }
  });

  return res.send('Email sent' + data);
}

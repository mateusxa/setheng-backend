import {sendEmail} from '../../utils';
import {sign} from 'jsonwebtoken';
import Company from '../../../models/company';
import {Request, Response} from 'express';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const email = req.body.email;
  const companyId = req.body.companyId;

  let company;

  try {
    company = await Company.get(companyId);
  } catch (error) {
    return res.status(400).send(Error('No company found!'));
  }

  const assingToken = sign(
    {
      companyId: company.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    }
  );

  return await sendEmail(
    email,
    `Você foi convidado para ${company.name}`,
    `<div>
            <h1>You have been invited to ${company.name}</h1>
            <a href="http://localhost:3000/register/invite/${assingToken}">Click here!</a>
        </div>`
  )
    .then(value => {
      return res.json({
        message: value,
      });
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

import {Request, Response} from 'express';
import Company from '../../../models/company';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const name = req.body.name;
  const taxId = req.body.taxId;

  return await Company.create(new Company(name, taxId))
    .then(company => {
      return res.send(company);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

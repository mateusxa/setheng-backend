import {Request, Response} from 'express';
import Company from '../../../models/company';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const {id} = req.query;

  const company = await Company.get(String(id));

  return res.send(company);
}

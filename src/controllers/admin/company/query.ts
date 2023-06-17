import {Request, Response} from 'express';
import Company from '../../../models/company';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const query = req.query as {
    limit?: string | null;
    name?: string | null;
    taxId?: string | null;
  };

  const companies = await Company.find(
    parseInt(query.limit as string) ? parseInt(query.limit as string) : null,
    query.name,
    query.taxId
  );

  return res.send(companies);
}

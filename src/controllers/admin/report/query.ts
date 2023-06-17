/* eslint-disable linebreak-style */
import {Request, Response} from 'express';
import Report from '../../../models/report';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const query = req.query as {
    limit?: string | null;
    name?: string | null;
    companyId?: string | null;
    category?: string | null;
  };

  const reports = await Report.find(
    parseInt(query.limit as string) ? parseInt(query.limit as string) : null,
    query.name,
    query.companyId,
    query.category
  );

  return res.send(reports);
}

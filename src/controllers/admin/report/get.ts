/* eslint-disable linebreak-style */
import {Request, Response} from 'express';
import Report from '../../../models/report';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const {id} = req.query;

  const report = await Report.get(String(id));

  return res.send(report);
}

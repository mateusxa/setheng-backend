import {Request, Response} from 'express';
import Report from '../../../models/report';
import {checkSuperUser} from '../../utils';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  if (!(await checkSuperUser(req))) {
    return res.status(400).json({
      error: 'Invalid token!',
    });
  }
  const {id} = req.query;

  const report = await Report.delete(String(id));

  return res.send(report);
}

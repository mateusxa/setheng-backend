import {Request, Response} from 'express';
import Report from '../../../models/report';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const name = req.body.name;
  const companyId = req.body.companyId;
  const category = req.body.category;
  const pdf = req.file?.buffer;

  if (pdf === undefined) return res.status(400).send();

  return await Report.create(new Report(name, companyId, category, pdf))
    .then(report => {
      return res.send(report);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

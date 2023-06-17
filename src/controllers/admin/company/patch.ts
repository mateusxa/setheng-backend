import {Request, Response} from 'express';
import Company from '../../../models/company';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const {id} = req.query;

  const patchData = {
    name: '',
    taxId: '',
  };

  if (req.body.name !== undefined) {
    patchData.name = req.body.name;
  }
  if (req.body.taxId !== undefined) {
    patchData.taxId = req.body.taxId;
  }

  return await Company.update(String(id), patchData)
    .then(company => {
      return res.send(company);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

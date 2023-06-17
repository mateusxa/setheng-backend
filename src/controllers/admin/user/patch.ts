import {Request, Response} from 'express';
import User from '../../../models/user';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const {id} = req.query;

  const patchData: {
    name?: string;
    firebaseId?: string | undefined;
    companyId?: string | undefined;
  } = {};

  if (req.body.name !== undefined) {
    patchData.name = req.body.name;
  }

  if (req.body.firebaseId !== undefined) {
    patchData.firebaseId = req.body.firebaseId;
  }

  if (req.body.companyId !== undefined) {
    patchData.companyId = req.body.companyId;
  }

  return await User.update(String(id), patchData)
    .then(user => {
      return res.send(user);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

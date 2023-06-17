import {Request, Response} from 'express';
import Company from '../../models/company';
import {checkInviteToken} from '../utils';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const inviteToken = await checkInviteToken(req);

  return await Company.get((inviteToken as {companyId: string}).companyId)
    .then(company => {
      return res.send(company);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

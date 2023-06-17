import {Request, Response} from 'express';
import User from '../../../models/user';
import {checkInviteToken} from '../../utils';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const inviteToken = await checkInviteToken(req);

  if (!inviteToken) {
    return res.status(400).json({
      error: 'Invalid token!',
    });
  }

  const body = JSON.parse(req.body);

  return await User.create(
    new User(
      body.name,
      body.firebaseId,
      (inviteToken as {companyId: string}).companyId
    )
  )
    .then(user => {
      return res.send(user);
    })
    .catch(error => {
      return res.status(400).send(Error(error));
    });
}

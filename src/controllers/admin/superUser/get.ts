import {Request, Response} from 'express';
import SuperUser from '../../../models/superUser';
import {checkSuperUser} from '../../utils';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  return checkSuperUser(req)
    .then(async token => {
      const user = await SuperUser.get(token.id);

      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(e => {
      return res.status(400).send(Error('Invalid token!'));
    });
}

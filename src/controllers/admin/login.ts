import SuperUser from '../../models/superUser';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import {sign} from 'jsonwebtoken';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const email = req.body.email;
  const password = req.body.password;

  const users = await SuperUser.find(null, null, email);

  if (users.length === 0) {
    return res.status(404).send({
      error: 'User not found!',
    });
  }

  const user = users[0];

  if (await bcrypt.compare(password, user.password)) {
    const token = sign(
      {
        id: user.id,
        type: 'super',
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
      }
    );
    return res.status(200).send({
      token: token,
    });
  }
  return res.status(400).send({
    error: 'Password does not match!',
  });
}

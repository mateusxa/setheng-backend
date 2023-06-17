import {Request, Response} from 'express';
import User from '../../../models/user';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const {id} = req.query;

  const user = await User.delete(String(id));

  return res.send(user);
}

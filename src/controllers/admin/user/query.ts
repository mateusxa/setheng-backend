import {Request, Response} from 'express';
import User from '../../../models/user';

export default async function handler(
  req: Request,
  res: Response
): Promise<Response> {
  const query = req.query as {
    limit?: string | null;
    name?: string | null;
    firebaseId?: string | null;
    companyId?: string | null;
  };

  const users = await User.find(
    parseInt(query.limit as string) ? parseInt(query.limit as string) : null,
    query.name,
    query.firebaseId,
    query.companyId
  );

  return res.send(users);
}

import {verify} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

export async function checkSuperUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  try {
    const token = req.headers['x-access-token'] as string;

    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      type: string;
      iat: number;
      exp: number;
    };

    if (decoded.type !== 'super') throw new Error('Not enough privilegies');

    next();
  } catch (e) {
    return res.status(400).json({
      error: 'Invalid token!',
    });
  }
}

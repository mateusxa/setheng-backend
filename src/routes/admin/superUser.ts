import {Router, Request, Response} from 'express';
import get from '../../controllers/admin/superUser/get';

const router = Router();

router.get('/:id', (req: Request, res: Response) => get(req, res));

export default router;

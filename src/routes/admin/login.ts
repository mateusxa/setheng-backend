import {Router, Request, Response} from 'express';
import login from '../../controllers/admin/login';

const router = Router();

router.post('/', (req: Request, res: Response) => login(req, res));

export default router;

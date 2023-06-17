import {Router, Request, Response} from 'express';
import get from '../../controllers/admin/user/get';
import patch from '../../controllers/admin/user/patch';
import post from '../../controllers/admin/user/post';
import query from '../../controllers/admin/user/query';

const router = Router();

router.get('/:id', (req: Request, res: Response) => get(req, res));
router.patch('/:id', (req: Request, res: Response) => patch(req, res));
router.post('/', (req: Request, res: Response) => post(req, res));
router.get('/', (req: Request, res: Response) => query(req, res));

export default router;

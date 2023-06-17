import {Router, Request, Response} from 'express';
import get from '../../controllers/admin/company/get';
import patch from '../../controllers/admin/company/patch';
import post from '../../controllers/admin/company/post';
import query from '../../controllers/admin/company/query';
import remove from '../../controllers/admin/company/remove';

const router = Router();

router.get('/:id', (req: Request, res: Response) => get(req, res));
router.patch('/:id', (req: Request, res: Response) => patch(req, res));
router.post('/', (req: Request, res: Response) => post(req, res));
router.get('/', (req: Request, res: Response) => query(req, res));
router.delete('/:id', (req: Request, res: Response) => remove(req, res));

export default router;

import {Router, Request, Response} from 'express';
import upload from '../../middleware/upload';
import get from '../../controllers/admin/report/get';
import post from '../../controllers/admin/report/post';
import query from '../../controllers/admin/report/query';
import remove from '../../controllers/admin/report/remove';

const router = Router();

router.get('/:id', (req: Request, res: Response) => get(req, res));
router.post('/', upload.single('file'), (req: Request, res: Response) =>
  post(req, res)
);
router.get('/', (req: Request, res: Response) => query(req, res));
router.delete('/:id', (req: Request, res: Response) => remove(req, res));

export default router;

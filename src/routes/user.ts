import {Router, Request, Response} from 'express';
import assign from '../controllers/user/assign';
import company from '../controllers/user/company';
import invite from '../controllers/user/invite';

const router = Router();

router.post('/assign', (req: Request, res: Response) => assign(req, res));
router.get('/company', (req: Request, res: Response) => company(req, res));
router.post('/invite', (req: Request, res: Response) => invite(req, res));

export default router;

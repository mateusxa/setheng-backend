import {checkSuperUser} from '../../middleware/checkSuperUser';
import {Router} from 'express';
import company from './company';
import report from './report';
import superUser from './superUser';
import user from './user';
import login from './login';

const router = Router();

router.use('/company', checkSuperUser, company);
router.use('/report', checkSuperUser, report);
router.use('/superUser', checkSuperUser, superUser);
router.use('/user', checkSuperUser, user);
router.use('/login', login);

export default router;

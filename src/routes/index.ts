import {Router} from 'express';
import admin from './admin';
import user from './user';

const router = Router();

router.use('/admin', admin);
router.use('/user', user);

export default router;

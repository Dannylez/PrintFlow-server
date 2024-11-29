import { Router } from 'express';
import client from './client.js';
import order from './order.js';
import comment from './comment.js';
import user from './user.js';
import task from './task.js';
import workStation from './workStation.js';
import material from './material.js';

const router = Router();

router.use('/client', client);
router.use('/order', order);
router.use('/comment', comment);
router.use('/user', user);
router.use('/task', task);
router.use('/workStation', workStation);
router.use('/material', material);

export default router;

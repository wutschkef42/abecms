import express from 'express';

import {
	getHooks,
} from './hooksController';

const router = express.Router();

router.get('/hooks', getHooks)

export default router
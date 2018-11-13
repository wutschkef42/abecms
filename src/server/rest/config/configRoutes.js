import express from 'express';

import {
	getConfig,
	saveConfig,
} from './configController';

const router = express.Router();

router.get('/', getConfig)

router.post('/', saveConfig)

export default router
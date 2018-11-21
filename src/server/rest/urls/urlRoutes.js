import express from 'express';

import {
	saveUrls,
} from './urlController';

const router = express.Router();

router.post('/', saveUrls)

export default router

import express from 'express';

import {
	getTemplate,
} from './templateController';

const router = express.Router();

router.get('/:name', getTemplate);

export default router

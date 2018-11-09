import express from 'express';

import {
	getTemplate,
	getTemplatesList,
} from './templateController';

const router = express.Router();

router.get('/:name', getTemplate)
router.get('/', getTemplatesList)

export default router

import express from 'express';

import {
	getTemplate,
	getTemplatesList,
	buildTemplate,
} from './templateController';

const router = express.Router();

router.get('/:name', getTemplate)
router.get('/', getTemplatesList)
router.post('/', buildTemplate)

export default router

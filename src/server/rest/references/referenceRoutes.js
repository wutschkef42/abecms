import express from 'express';

import {
	saveReferences,
	getReferences,
	getReference,
	removeReference,
} from './referenceController';

const router = express.Router();

router.get('/', getReferences)
router.get('/:name', getReference)
router.delete('/:name', removeReference)
router.post('/', saveReferences)

export default router
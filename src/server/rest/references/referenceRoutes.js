import express from 'express';

import {
	saveReferences,
	getReferences,
} from './referenceController';

const router = express.Router();

router.get('/references', getReferences)

router.post('/references', saveReferences)

export default router
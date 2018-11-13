import express from 'express';

import {
	postStructure,
	getStructures,
	deleteStructure,
} from './structureController';

const router = express.Router();

router.get('/', getStructures)

router.post('/', postStructure)

router.delete('/', deleteStructure)

export default router
import express from 'express';

import {
	getActivities,
} from './activitiesController';

const router = express.Router();

router.get('/', getActivities)

export default router
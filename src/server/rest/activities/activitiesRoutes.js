import express from 'express';

import {
	getActivities,
} from './activitiesController';

const router = express.Router();

router.get('/activities', getActivities)

export default router
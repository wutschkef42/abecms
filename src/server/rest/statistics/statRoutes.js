import express from 'express';

import {
	getTotalUsers,
	getConnectedUsers,
	getTotalPages,
	getPublishedPage,
} from './statController';

const router = express.Router();

router.get('/users/total', getTotalUsers)
router.get('/users/connected', getConnectedUsers)
router.get('/pages/total', getTotalPages)
router.get('/pages/published', getPublishedPage)

export default router
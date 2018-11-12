import express from 'express';

import {
	saveConfig,
	saveReferences,
	getThumbs,
	getReferences,
	getImage,
	getStructure,
	postStructure,
	postUpload,
	getListHooks,
	getListWorkflows,
	getActivities,
	
} from './otherController';

const router = express.Router();

router.post('/save/config', saveConfig)

router.get('/activities', getActivities)

router.get('/hooks', getListHooks)

router.get('/image', getImage)

router.get('/references', getReferences)
router.post('/references', saveReferences)

router.get('/structure', getStructure)
router.post('/structure', postStructure)

router.get('/thumbs', getThumbs)

router.post('/upload', postUpload)

router.get('/workflows', getListWorkflows)




export default router

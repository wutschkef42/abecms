import express from 'express';

import {
	updatePage,
	removePage,
	getPage,
	createPage,
	listAll,
	paginate,
	unpublish,
	publish,
	savePage,
} from './pageController';

const router = express.Router();

//router.get('/', listAll)
router.get('/', getPage)
router.post('/', createPage)
router.post('/save', savePage)
router.put('/', updatePage) // = /operations/edit/draft
router.delete('/', removePage)

router.get('/paginate', paginate)

router.put('/publish', publish)
router.put('/unpublish', unpublish)

export default router

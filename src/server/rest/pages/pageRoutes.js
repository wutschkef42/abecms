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
	duplicatePage,
	draftPage,
	editPage,
} from './pageController';

const router = express.Router();

//router.get('/', listAll)
router.get('/', getPage)
router.post('/', createPage)
router.post('/save*', savePage)
router.put('/*', updatePage) // = /operations/edit/draft
router.post('/draft*', draftPage)
router.post('/edit*', editPage)
router.delete('/*', removePage)
router.post('/duplicate', duplicatePage)

router.get('/paginate', paginate)

router.post('/publish', publish)
router.get('/unpublish/*', unpublish)

export default router

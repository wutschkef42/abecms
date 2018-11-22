import express from 'express';
const router = express.Router();


import activitiesRoutes from './activities/activitiesRoutes'
import userRoutes from './users/userRoutes'
import pageRoutes from './pages/pageRoutes'
import roleRoutes from './roles/roleRoutes'
import templateRoutes from './templates/templateRoutes'
import themeRoutes from './theme/themeRoutes'
import structureRoutes from './structures/structureRoutes'
import workflowRoutes from './workflows/workflowRoutes'
import referenceRoutes from './references/referenceRoutes'
import urlsRoutes from './urls/urlRoutes'
import statRoutes from './statistics/statRoutes'

import { getFullWorkflows } from './workflows/workflowController'
import { getUrls } from './urls/urlController'

import * as workflowController from './workflows/workflowController'
import * as statController from './statistics/statController'
import * as userController from './users/userController'
import * as urlController from './urls/urlController'
import * as themeController from './theme/themeController'
import * as templateController from './templates/templateController'
import * as structureController from './structures/structureController'
import * as roleController from './roles/roleController'
import * as referenceController from './references/referenceController'
import * as pageController from './pages/pageController'
import * as imageController from './images/imageController'
import * as hookController from './hooks/hooksController'
import * as configController from './config/configController'
import * as activitiesController from './activities/activitiesController'

export const controllers = {
	workflowController,
	statController,
	userController,
	urlController,
	themeController,
	templateController,
	structureController,
	roleController,
	referenceController,
	pageController,
	imageController,
	hookController,
	configController,
	activitiesController,
}

const apiRoutes = {
							'activities': activitiesRoutes,
							'users': userRoutes,
							'pages': pageRoutes,
							'roles': roleRoutes,
							'templates': templateRoutes,
							'theme': themeRoutes,
							'structures': structureRoutes,
							'workflows': workflowRoutes,
							'references': referenceRoutes, 
							'urls': urlsRoutes,
							'stats': statRoutes,
						}

router.use('/', userRoutes)
router.use('/pages', pageRoutes)
router.use('/roles', roleRoutes)
router.use('/templates', templateRoutes)
router.use('/theme', themeRoutes)
router.use('/structures', structureRoutes)
router.use('/workflows', workflowRoutes)
router.use('/references', referenceRoutes)
router.use('/urls', urlsRoutes)
router.use('/stats', statRoutes)
router.use('/activities', activitiesRoutes) 

router.get('/workflows/full',function(req, res, next) {
	getFullWorkflows(router, req, res, next)
})
router.get('/urls',function(req, res, next) {
	getUrls(router, req, res, next)
})


import store from './store'
store.routers.push(router)

for (var i in apiRoutes) {
	store.routers.push(apiRoutes[i])
}

export const apiRouter = router

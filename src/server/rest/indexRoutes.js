import express from 'express';
import store from './store'

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
import { getRoles } from './roles/roleController'

router.use('/users', userRoutes)
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



store.router = router
store.restRouters = [ userRoutes.stack, pageRoutes.stack, roleRoutes.stack,templateRoutes.stack, themeRoutes.stack, structureRoutes.stack, workflowRoutes.stack ]

export default router
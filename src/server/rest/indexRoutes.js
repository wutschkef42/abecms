import express from 'express';

const router = express.Router();

import userRoutes from './users/userRoutes'
import pageRoutes from './pages/pageRoutes'
import roleRoutes from './roles/roleRoutes'
import templateRoutes from './templates/templateRoutes'
import themeRoutes from './theme/themeRoutes'
import structureRoutes from './structures/structureRoutes'
import workflowRoutes from './workflows/workflowRoutes'

import { getFullWorkflows } from './workflows/workflowController'

router.use('/users', userRoutes)
router.use('/pages', pageRoutes)
router.use('/roles', roleRoutes)
router.use('/templates', templateRoutes)
router.use('/theme', themeRoutes)
router.use('/structures', structureRoutes)
router.use('/workflows', workflowRoutes)

router.get('/workflows/full',function(req, res, next) {
	getFullWorkflows(router, req, res, next)
})

export default router
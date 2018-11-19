import {
	config,
	User,
} from '../../../cli'

export const getWorkflows = (req, res) => {
	return res.status(200).json({
		workflows: config.users.workflow
	})
}

export const getFullWorkflows = async (router, req, res, next) => {

	const routes = router.stack
	let urls = []

	Array.prototype.forEach.call(routes, function(route) {
		if (!route.route || !route.route.path) { return ; }
		urls.push({
			url: route.route.path,
			method: Object.keys(route.route.methods)[0].toUpperCase(),
			regex: route.route.path.replace(/\*$/, '') + '.*'
		})
	})

	var workflowUrl = {}
	var previous = ''
	var nextWorkflow = ''

	const roles = Object.keys(config.users.roles);

	let workflowsFull = {}

	Array.prototype.forEach.call(roles, role => {

		workflowsFull[role] = {};

		Array.prototype.forEach.call(config.users.workflow, flow => {

			workflowsFull[role][flow] = []
			var current = false
			if (flow != 'publish') {
				Array.prototype.forEach.call(config.users.workflow, flowCheck => {
					if (current) {
						nextWorkflow = flowCheck
						current = false
					}
					if (flow === flowCheck) {
						current = true
					}
				})
			} else {
				nextWorkflow = 'draft'
			}
			workflowUrl[flow] = []
	
	
	
			if (User.utils.isUserAllowedOnRoute(role, `/abe/operations/edit/${flow}`)) {
				workflowsFull[role][flow].push({
					url: `/abe/operations/edit/${flow}`,
					action: 'edit',
					workflow: flow,
					previous: previous,
					next: nextWorkflow
				})
			}
	
			if (User.utils.isUserAllowedOnRoute(role, `/abe/operations/delete/${flow}`)) {
				workflowsFull[role][flow].push({
					url: `/abe/operations/delete/${flow}`,
					action: 'delete',
					workflow: flow,
					previous: previous,
					next: nextWorkflow
				})
			}
	
			if (User.utils.isUserAllowedOnRoute(role, `/abe/operations/submit/${flow}`)) {
				workflowsFull[role][flow].push({
					url: `/abe/operations/submit/${flow}`,
					action: 'submit',
					workflow: flow,
					previous: previous,
					next: nextWorkflow
				})
			}
	
	
			if (flow !== 'draft') {
				if (User.utils.isUserAllowedOnRoute(role, `/abe/operations/reject/${flow}`)) {
					workflowsFull[role][flow].push({
						url: `/abe/operations/reject/${flow}`,
						action: 'reject',
						workflow: flow,
						previous: previous,
						next: nextWorkflow
					})
				}
	
				if (User.utils.isUserAllowedOnRoute(role, `/abe/api/pages/unpublish`)) {
					workflowsFull[role][flow].push({
						url: `/abe/api/pages/unpublish`,
						action: 'unpublish',
						workflow: flow,
						previous: previous,
						next: nextWorkflow
					})
				}
			}
			previous = flow
		})

	})

	

	return res.json({
		roles: config.users.roles,
		workflows: config.users.workflow,
		full: workflowsFull
	})
	
}

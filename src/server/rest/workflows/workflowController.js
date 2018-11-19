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
/*
	if (
        typeof routes[workflow] !== 'undefined' &&
        routes[workflow] !== null
      ) {
        Array.prototype.forEach.call(routes[workflow], route => {
          var reg = new RegExp(route)
          if (reg.test(currentRoute)) {
            isAllowed = true
          }
        })
	  }
	  */

	var workflowUrl = {}
	var previous = ''
	var nextWorkflow = ''
	Array.prototype.forEach.call(config.users.workflow, flow => {
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

		if (User.utils.isUserAllowedOnRoute(res.user.role.workflow, `/abe/operations/edit/${flow}`)) {
			workflowUrl[flow].push({
				url: `/abe/operations/edit/${flow}`,
				action: 'edit',
				workflow: flow,
				previous: previous,
				next: nextWorkflow
			})
		}

		if (User.utils.isUserAllowedOnRoute(res.user.role.workflow, `/abe/operations/delete/${flow}`)) {
			workflowUrl[flow].push({
				url: `/abe/operations/delete/${flow}`,
				action: 'delete',
				workflow: flow,
				previous: previous,
				next: nextWorkflow
			})
		}

		if (User.utils.isUserAllowedOnRoute(res.user.role.workflow, `/abe/operations/submit/${flow}`)) {
			workflowUrl[flow].push({
				url: `/abe/operations/submit/${flow}`,
				action: 'submit',
				workflow: flow,
				previous: previous,
				next: nextWorkflow
			})
		}


		if (flow !== 'draft') {
			if (User.utils.isUserAllowedOnRoute(res.user.role.workflow, `/abe/operations/reject/${flow}`)) {
				workflowUrl[flow].push({
					url: `/abe/operations/reject/${flow}`,
					action: 'reject',
					workflow: flow,
					previous: previous,
					next: nextWorkflow
				})
			}

			if (User.utils.isUserAllowedOnRoute(res.user.role.workflow, `/abe/api/pages/unpublish`)) {
				workflowUrl[flow].push({
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

	return res.json({
		roles: config.users.roles,
		workflows: config.users.workflow,
		workflowsData: workflowUrl
	})
	
}

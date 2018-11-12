const path = require('path');
const Joi = require('joi');

import {
	cmsOperations,
	abeExtend,
	Manager,
	config,
	User,
	cmsData,

} from '../../../cli'

import pageHelper from '../../helpers/page-rest'

/* TODO
 *
 * body verification & validations on all functions
 */

export const createPage = (req, res, next) => {

	var decoded = User.utils.decodeUser(req, res)
	var user = User.utils.findSync(decoded.iss)
	res.user = user

	const postUrl = req.body.name;

	const p = cmsOperations.create(
		req.body.template,
		postUrl,
		req.body,
		res.user
	)

	p.then(
		resSave => {
			var result = {
				success: 1,
				json: resSave
			}

			Manager.instance.events.activity.emit('activity', {
				operation: 'creation',
				post: resSave.link,
				user: res.user
			})

			res.set('Content-Type', 'application/json')
			res.status(200).send(JSON.stringify(result))
		},
		() => {
			res.set('Content-Type', 'application/json')
			res.status(422).json({
				message: 'Server cannot create the page :/'
			})
		}
	)
}

export const updatePage = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = { workflow: 'draft', postUrl: req.body.json.name }

	var p = cmsOperations.post.submit(
		operation.postUrl,
		req.body.json,
		operation.workflow,
		res.user
	)

	p.then(
		result => {
			Manager.instance.events.activity.emit('activity', {
				operation: operation.workflow,
				post: operation.postUrl,
				user: res.user
			})
			res.set('Content-Type', 'application/json')
			res.send(JSON.stringify(result))
		},
		result => {
			res.set('Content-Type', 'application/json')
			res.send(JSON.stringify(result))
		}
	)
	.catch(function(e) {
		console.error('[ERROR] post-save.js', e)
	})
}

export const publish = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = { workflow: 'publish', postUrl: req.body.url }

	var p = cmsOperations.post.submit(
		operation.postUrl,
		req.body.json,
		operation.workflow,
		res.user
	)

	p.then(
		result => {
		// Auto-republish if the config is setup and the posts limit is not reached
		if (
			operation.workflow === 'publish' &&
			config.publish['auto-republish'] &&
			config.publish['auto-republish'].active
		) {
			var nbPosts = Manager.instance.getList().length
			if (config.publish['auto-republish'].limit >= nbPosts) {
				var generateArgs = []
				generateArgs.push(
					`ABE_DESTINATION=${path.relative(
					config.root,
					Manager.instance.pathPublish
					)}`
				)

				var proc = abeExtend.process(
					'generate-posts',
					generateArgs,
					data => {
					res.app.emit('generate-posts', data)
					}
				)
				if (proc) {
					res.app.emit('generate-posts', {percent: 0, time: '00:00sec'})
					console.log('generate-posts emitted')
				}
			}
		}

		Manager.instance.events.activity.emit('activity', {
			operation: operation.workflow,
			post: operation.postUrl,
			user: res.user
		})
		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(result))
		},
		result => {
			res.set('Content-Type', 'application/json')
			res.send(JSON.stringify(result))
		}
	)
	.catch(function(e) {
		console.error('[ERROR] submit.js', e)
	})
}

export const unpublish = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var postUrl = req.body.url;

	cmsOperations.post.unpublish(postUrl, res.user)

	var result = {
		success: 1,
		file: postUrl
	}

	Manager.instance.events.activity.emit('activity', {
		operation: 'unpublish',
		post: postUrl,
		user: res.user
	})
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(result))
}

export const removePage = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	cmsOperations.remove.remove(req.body.url)
  
	var result = {
		success: 1,
		file: operation.postUrl
	}
  
	Manager.instance.events.activity.emit('activity', {
		operation: operation.workflow,
		post: operation.postUrl,
		user: res.user
	})
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(result))
}

export const getPage = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	var filePath = req.query.page

	console.log(filePath, path.extname(filePath) != `.${config.files.templates.extension}`)
  
	if (
		filePath != null &&
		path.extname(filePath) != `.${config.files.templates.extension}`
	) {
		next()
		return
	}
  
	pageHelper(req, res, next)
}

export const paginate = (req, res, next) => {
	var start = 0
	var length = 25
	var sortField = 'date'
	var sortOrder = -1
	var search = ''
  
	var values = ['date', 'abe_meta.link', 'abe_meta.template', 'date']
	Array.prototype.forEach.call(config.users.workflow, flow => {
	  values[i] = 'abe_meta.' + flow
	  ++i
	})
  
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	if (typeof req.query.start !== 'undefined') {
	  start = +req.query.start
	}
  
	if (typeof req.query.length !== 'undefined') {
	  length = +req.query.length
	}
  
	var i = 4
	if (typeof req.query.order !== 'undefined') {
	  sortField = values[req.query.order[0]['column']]
	  sortOrder = req.query.order[0]['dir'] === 'desc' ? -1 : 1
	}
  
	if (
	  typeof req.query.search !== 'undefined' &&
	  req.query.search.value !== ''
	) {
	  search = req.query.search.value
	}
  
	var list = Manager.instance.getPage(
	  start,
	  length,
	  sortField,
	  sortOrder,
	  search
	)
  
	if (typeof req.query.draw !== 'undefined') {
	  list['draw'] = req.query.draw
	}
  
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(list))
}

export const listAll = (req, res, next) => {
	
}

export const savePage = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	pageHelper(req, res, next, true)
}

export const reject = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = {
		workflow: 'draft',
		postUrl: req.body.url,
	}

	var p = cmsOperations.post.reject(
		operation.postUrl,
		req.body.json,
		operation.workflow,
		res.user
	)

	p.then(
		result => {
			Manager.instance.events.activity.emit('activity', {
				operation: 'reject',
				post: operation.postUrl,
				user: res.user
			})
			res.set('Content-Type', 'application/json')
			res.send(JSON.stringify(result))
		},
		result => {
			res.set('Content-Type', 'application/json')
			res.send(JSON.stringify(result))
		}
	)
	.catch(function(e) {
		console.error('[ERROR] post-reject.js', e)
	})
}

export function getWorkflowFromOperationsUrl(str) {
	let regUrl = /\/abe\/restx\/reject\/(.*?)\/(.*?)\//
	var workflow = 'draft'
	var match = str.match(regUrl)
	if (match != null && match[2] != null) {
	  	workflow = match[2]
	}
	var postUrl = str.replace(regUrl, '')
	return {
		workflow: workflow,
		postUrl: postUrl
	}
}
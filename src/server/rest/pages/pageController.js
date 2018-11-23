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

	console.log(req.body)
	var decoded = User.utils.decodeUser(req, res)
	var user = User.utils.findSync(decoded.iss)
	res.user = user

	const postUrl = '/' + req.body.postPath;
	const toSave = req.body.toSave;

	const p = cmsOperations.create(
		req.body.abe_meta.template,
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

export const editPage = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = getWorkflowFromApiUrlSave(req.originalUrl)
	operation.workflow = req.body.json.abe_meta.status
	
	console.log('edit', operation)

  var p = cmsOperations.post.submit(
    operation.postUrl,
    req.body.json,
    operation.workflow,
    res.user
  )

  p
    .then(
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

export const draftPage = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	let workflow = req.body.type || 'draft'
	var operation = { workflow: workflow, postUrl: req.body.name }

	console.log(req.body)

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

export const updatePage = (req, res, next) => {

	var filepath = req.originalUrl.replace('/abe/api/pages', '')
	var folderName = filepath.split('/')
	var postName = folderName.pop()
	folderName = folderName.join('/')
  
	var oldFilePath = req.body.oldFilePath
	delete req.body.oldFilePath

	console.log(oldFilePath, folderName, postName, filepath, req.body.abe_meta.template)
  
	var p = cmsOperations.duplicate(
	  oldFilePath,
	  req.body.abe_meta.template,
	  folderName,
	  postName,
	  req,
	  true,
	  res.user
	)
  
	p
	  .then(
		resSave => {
		  var result = {
			success: 1,
			json: resSave
		  }
  
		  Manager.instance.events.activity.emit('activity', {
			operation: 'update',
			post: resSave.link,
			user: res.user
		  })
		  res.set('Content-Type', 'application/json')
		  res.send(JSON.stringify(result))
		},
		() => {
		  var result = {
			success: 0
		  }
		  res.set('Content-Type', 'application/json')
		  res.send(JSON.stringify(result))
		}
	  )
	  .catch(function(e) {
		console.error(e.stack)
	  })
}

export const publish = (req, res, next) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = { workflow: 'publish', postUrl: req.body.json.abe_meta.link }

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

	const postUrl = req.originalUrl.replace('/abe/api/pages/unpublish', '')

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
	if (typeof res._header !== 'undefined' && res._header !== null) return

	const postUrl = req.originalUrl.replace('/abe/api/pages/', '')

	const indexOfSlash = postUrl.indexOf('/');

	const operation = { workflow: postUrl.slice(0, indexOfSlash), postUrl: postUrl.slice(indexOfSlash) }
  
	cmsOperations.remove.remove(operation.postUrl)
  
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

export const savePage = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return
	
	var operation = getWorkflowFromApiUrlSave(req.originalUrl, req.body)
	
	console.log('save',operation)

  var p = cmsOperations.post.submit(
    operation.postUrl,
    req.body.json,
    operation.workflow,
    res.user
  )

  p
    .then(
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

export const reject = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	var operation = {
		workflow: req.body.json.abe_meta.status,
		postUrl: req.body.json.abe_meta.link,
	}
	

	console.log(operation)

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

function getWorkflowFromApiUrlReject(str) {
  let regUrl = /\/abe\/api\/pages\/reject\/(.*?)\//
  var workflow = 'draft'
	var match = str.match(regUrl)
  if (match != null && match[1] != null) {
    workflow = match[1]
	}
	var postUrl = str.replace(regUrl, '')
	console.log(match)
  return {
    workflow: workflow,
    postUrl: postUrl
  }
}

function getWorkflowFromApiUrlSave(str, body) {
  let regUrl = /\/abe\/api\/pages\/save\/(.*?)\//
  var workflow = 'draft'
	var match = str.match(regUrl)
  if (match != null && match[1] != null) {
    workflow = match[1]
	}
	var postUrl = str.replace(regUrl, '')
  return {
    workflow: workflow,
    postUrl: postUrl
  }
}

function getWorkflowFromApiUrl(str, body) {
  let regUrl = /\/abe\/api\/pages\/(.*?)\//
  var workflow = 'draft'
	var match = str.match(regUrl)
  if (match != null && match[2] != null) {
    workflow = match[2]
	}
	if (body && body.json && body.json.abe_meta) {
		if (body.json.abe_meta.status) {
			workflow = body.json.abe_meta.status
		}
	}
	var postUrl = '/' + str.replace(regUrl, '')
  return {
    workflow: workflow,
    postUrl: postUrl
  }
}

export const duplicatePage = (req, res) => {
	var filepath = req.body.postPath;
  var folderName = filepath.split('/')
  var postName = folderName.pop()
  folderName = folderName.join('/')

  var oldFilePath = req.body.oldFilePath
  delete req.body.oldFilePath

  var p = cmsOperations.duplicate(
    oldFilePath,
    req.body.abe_meta.template,
    folderName,
    postName,
    req,
    false,
    res.user
  )

  p
    .then(
      resSave => {
        var result = {
          success: 1,
          json: resSave
        }

        Manager.instance.events.activity.emit('activity', {
          operation: 'duplicate',
          post: resSave.link,
          user: res.user
        })
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(result))
      },
      () => {
        var result = {
          success: 0
        }
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(result))
      }
    )
    .catch(function(e) {
      console.error('[ERROR] get-duplicate.js', e)
    })
}
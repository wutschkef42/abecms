const path = require('path');
const Joi = require('joi');

import {
	config,
	Manager,
	cmsReference,
	abeExtend,
	cmsThemes,
} from '../../../cli'

/* TODO
 * validations of data
 * REST errors
 */

export const saveConfig = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	config.save(req.body.json)
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(req.body.json))
}

export const saveReferences = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return
	cmsReference.reference.saveFile(req.body.url, req.body.json)
	if (
		config.publish['auto-republish'] &&
		config.publish['auto-republish'].active
	) {
		const nbPosts = Manager.instance.getList().length
		if (config.publish['auto-republish'].limit >= nbPosts) {
		const generateArgs = []
		generateArgs.push(
			`ABE_DESTINATION=${path.relative(
			config.root,
			Manager.instance.pathPublish
			)}`
		)

		const proc = abeExtend.process('generate-posts', generateArgs, data => {
			res.app.emit('generate-posts', data)
		})
		if (proc) {
			res.app.emit('generate-posts', {percent: 0, time: '00:00sec'})
			console.log('generate-posts emitted')
		}
		}
	}
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({success: 1}))
}

export const getThumbs = (req, res) => {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({
		thumbs: Manager.instance.getThumbsList()
	}))
}

export const getReferences = (req, res) => {
	console.log('get references')
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({
		references: Manager.instance.getReferences()
	}))
}

export const getImage = (req, res) => {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(
		cmsMedia.image.getAssociatedImageFileFromThumb(req.query.name)
		)
	)
}

export const getStructure = (req, res) => {
	const structure = Manager.instance.getStructureAndTemplates().structure
	const jsonResult = JSON.stringify(structure).replace(
		new RegExp(config.root, 'g'),
		''
	)
	res.status(200).send(jsonResult)
}

export const postStructure = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return
	cmsStructure.structure.editStructure(req.body.type, req.body.folderPath)
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({success: 1}))
}

export const postUpload = (req, res) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	var image = cmsMedia.image.saveFile(req)
  
	image.then(function(resp) {
		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(resp))
	})
	.catch(function(e) {
		console.error('[ERROR] post-upload', e)
	})
}

import hooksDefault from '../../../hooks/hooks'
import { cpus } from 'os';

export const getListHooks = (req, res, next) => {

	var allHooks = []

	Array.prototype.forEach.call(Object.keys(hooksDefault), hook => {
		var hookString = hooksDefault[hook] + ''
		var match = /\((.*?)\)/.exec(hookString)
		var matchReturn = /return ([a-z1-Z-1-9]+)/.exec(hookString)
		allHooks.push({
			name: hook,
			params: match ? match[1] : 'null',
			back: matchReturn ? matchReturn[1].replace(';', '') : 'null'
		})
	})

	return res.status(200).json({
		hooks: allHooks
	})
}

export const getListWorkflows = (req, res) => {
	return res.status(200).json({
		workflows: config.users.workflow
	})
}

export const getActivities = (req, res) => {
	const activities = Manager.instance.getActivities()
	return res.status(200).json({
		activities
	})
}
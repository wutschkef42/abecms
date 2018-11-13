const path = require('path');
const Joi = require('joi');

import {
	config,
	Manager,
	cmsReference,
	abeExtend,
} from '../../../cli'

export const getReferences = (req, res) => {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({
		references: Manager.instance.getReferences()
	}))
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
	res.json({
		success: 1
	})
}
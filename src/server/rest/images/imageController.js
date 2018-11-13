const path = require('path');
const Joi = require('joi');

import {
	abeExtend,
	cmsMedia,
} from '../../../cli'

export const getImage = (req, res) => {
	res.set('Content-Type', 'application/json')
	res.json({
		image: cmsMedia.image.getAssociatedImageFileFromThumb(req.query.name)
	})
}

export const uploadImage = (req, res) => {
	abeExtend.hooks.instance.trigger('beforeRoute', req, res, next)
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	var image = cmsMedia.image.saveFile(req)
  
	image.then(function(resp) {
		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(resp))
	})
	.catch(function(e) {
		console.error('[ERROR] post-upload', e)
		res.status(500).json({ error: 'processing_error', message: 'We cannot process the uploaded file' })
	})
}

export const getThumbs = (req, res) => {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({
		thumbs: Manager.instance.getThumbsList()
	}))
}
const path = require('path');
const Joi = require('joi');

import {
	cmsThemes,
} from '../../../cli'


export const getThemes = (req, res) => {
	console.log('themes')
	cmsThemes.themes.getThemeInfos().then(json => {
		res.json({ data: json })
	})
}

export const postThemes = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	if (req.body.zipUrl != null) {
	  	cmsThemes.themes
			.downloadTheme(req.body.zipUrl)
			.then(function(resp) {
				res.set('Content-Type', 'application/json')
				res.send(JSON.stringify(resp))
			})
			.catch(function(e) {
				res.set('Content-Type', 'application/json')
				res.send(JSON.stringify({error: 1}))
			})
	} else {
		res.status(400).json({ error: 'Bad request' })
	}
}

export const deleteTheme = (req, res) => {
	cmsThemes.themes.deleteTheme()
    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify({success: 1}))
}
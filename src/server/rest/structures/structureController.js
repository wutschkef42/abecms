const path = require('path');
const Joi = require('joi');

import {
	config,
	Manager,
	cmsStructure,
} from '../../../cli'

export const getStructures = (req, res) => {
	const structure = Manager.instance.getStructureAndTemplates().structure
	// remove full path
	const jsonResult = JSON.stringify(structure).replace(new RegExp(config.root + '/structure', 'g'), '')

	res.status(200).send(jsonResult)
}

export const getStructureByPath = (req, res) => {
	const structure = Manager.instance.getStructureAndTemplates().structure
	
}

export const deleteStructure = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	const result = cmsStructure.structure.editStructure(
		'delete',
		'structure' + req.body.folderPath
	)

	console.log(result)

	res.set('Content-Type', 'application/json')
	res.json({
		success: 1
	})
}

export const postStructure = (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

	const result = cmsStructure.structure.editStructure(
		'add',
		'structure/' + req.body.folderPath
	)

	console.log(result)

	res.set('Content-Type', 'application/json')
	res.json({
		success: 1
	})
}
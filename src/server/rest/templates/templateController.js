import path from 'path'

import { stat, readFile } from 'fs'
import { promisify } from 'util'

const statAsync = promisify(stat);
const readFileAsync = promisify(readFile)

import { User, config } from '../../../cli'
const Joi = require('joi');

export const getTemplate = async (req, res) => {
	const templateFile = `${path.join(config.root, config.themes.path, config.themes.name, config.themes.templates.path, req.params.name)}.html`;
	
	try {
		const file_fd = await statAsync(templateFile)
		const templateData = await readFileAsync(templateFile)
		res.status(200).json({
			templateData,
		})
	}
	catch (e) {
		if (e.code) {
			if (e.code === 'ENOENT') {
				res.status(422).json({
					message: 'No template file called ' + req.params.name,
					code: '-2'
				})
			} else {
				res.status(422).json({
					message: 'No template file called ' + req.params.name,
					code: '-21',
					e,
				})
			}
		} else {
			res.status(422).json({
				message: 'Weird error',
				e
			})
		}
	}
}
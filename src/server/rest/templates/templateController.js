import path from 'path'
import mkdirp from 'mkdirp'
import fse from 'fs-extra'

import { stat, readFile } from 'fs'
import { promisify } from 'util'

const statAsync = promisify(stat);
const readFileAsync = promisify(readFile)

import { Manager, config, coreUtils, cmsData } from '../../../cli'
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

export const getTemplatesList = async (req, res) => {
	const list = Manager.instance.getStructureAndTemplates();
    res.json([...list.templates]);
}

export const buildTemplate = async (req, res) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return

  if (req.body.name != null) {
    console.log(req.body.name, req.body.partials)

    let partialsAr = req.body.partials.split(',')
    let partials = ''
    partialsAr.map(function(elt, index){
      partials += '{{abe type="import" file="' + elt.replace('.png', '.html').replace(/^\/+/g, '') + '"}}\n'
    })
    let file = path.join(Manager.instance.pathTemplates,'/layout.' + config.files.templates.extension)
	let saveFile = path.join(Manager.instance.pathTemplates, '/' + req.body.name + '.' + config.files.templates.extension)
	console.log(coreUtils.file.exist(saveFile))
    if (coreUtils.file.exist(saveFile)) {
      let text = fse.readFileSync(file, 'utf8')
      let regions = cmsData.regex.getTagAbeWithType(text, 'region')
      if (regions.length > 0) {
        let obj = cmsData.attributes.getAll(regions[0], {})
        console.log(obj.key)
        text = text.replace(regions[0], partials)
      }
      mkdirp.sync(path.dirname(saveFile))
      fse.writeFileSync(saveFile, text)
    } else {
		let text = partials
		mkdirp.sync(path.dirname(saveFile))
      	fse.writeFileSync(saveFile, text)
	}
  }
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify({success: 1}))
}
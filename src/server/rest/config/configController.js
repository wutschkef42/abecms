import {
	config,
} from '../../../cli'

export const getConfig = (req, res) => {
	
}

export const saveConfig = (req, res, next) => {
	if (typeof res._header !== 'undefined' && res._header !== null) return
  
	config.save(req.body.json)

	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(req.body.json))
}
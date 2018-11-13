const Joi = require('joi');

import {
	Manager,
} from '../../../cli'

export const getActivities = (req, res) => {
	const activities = Manager.instance.getActivities()
	
	return res.status(200).json({
		activities
	})
}
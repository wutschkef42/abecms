
import {config} from '../../../cli'
import store from '../store'
import express from 'express'

export const getRoles = (req, res) => {
	var roles = config.users.roles

	return res.json({
		roles
	})
}

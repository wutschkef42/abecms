import path from 'path'

import { config, User } from '../../../cli'
const Joi = require('joi');

export const getUrls = async (router, req, res, next) => {
	let routes = router.stack;

	/*
	Array.prototype.forEach.call(store.routers, routr => {
		routes = routes.concat(routr.stack)
	})
	*/

	var urls = []
	var permissions = {}
  
	urls.push({
	  url: '/abe',
	  method: '/GET',
	  regex: '/abe'
	})

	console.log('start it')
  
	Array.prototype.forEach.call(routes, function(route) {
	  if (!route.route || !route.route.path) { return ; }
	  urls.push({
		url: route.route.path,
		method: Object.keys(route.route.methods)[0].toUpperCase(),
		regex: route.route.path.replace(/\*$/, '') + '.*'
	  })
	})



	const roles = Object.keys(config.users.roles);


	Array.prototype.forEach.call(roles, (role) => {
		permissions[role] = {};

		Array.prototype.forEach.call(urls, url => {
			if (User.utils.isUserAllowedOnRoute(role, url.regex)) {
				permissions[role][url.url] = true
			} else {
				permissions[role][url.url] = false
			}
		})
	})

	var perms = {}

	Array.prototype.forEach.call(urls, url => {
		perms[url.url] = {
			method: url.method,
			regex: url.regex,
			roles: {}
		}

		Array.prototype.forEach.call(roles, role => {
			if (User.utils.isUserAllowedOnRoute(role, url.url)) {
				perms[url.url]['roles'][role] = true
			} else {
				perms[url.url]['roles'][role] = false
			}
		})
	})

	console.log('end of fct')

	res.json({
		permissions,
		perms,
		urls
	})
}

export const saveUrls = async (req, res) => {
	const authorizations = req.body

	console.log(authorizations)

	let json = config.getLocalConfig()

	Array.prototype.forEach.call(Object.keys(authorizations), key => {
		if (key != 'admin') {
			json.users.routes[key] = authorizations[key]
		}
	})

	config.users.routes = json.users.routes
	config.save(json)

	res.json({
		success: 1,
		message: 'config saved'
	})
}
import hooksDefault from '../../../hooks/hooks'

export const getHooks = (req, res, next) => {

	var allHooks = []

	Array.prototype.forEach.call(Object.keys(hooksDefault), hook => {
		var hookString = hooksDefault[hook] + ''
		var match = /\((.*?)\)/.exec(hookString)
		var matchReturn = /return ([a-z1-Z-1-9]+)/.exec(hookString)
		allHooks.push({
			name: hook,
			params: match ? match[1] : 'null',
			back: matchReturn ? matchReturn[1].replace(';', '') : 'null'
		})
	})

	return res.status(200).json({
		hooks: allHooks
	})
}

import {config} from '../../../cli'

export const getRoles = (req, res) => {
	var roles = config.users.roles

	return res.json(roles)
}

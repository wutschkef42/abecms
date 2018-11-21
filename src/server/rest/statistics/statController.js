import {
	Manager,
	User
} from '../../../cli'

export const getTotalUsers = (req, res) => {
	res.json({ total: User.utils.getAll().length })
}

export const getConnectedUsers = (req, res) => {
	res.json({ total: Manager.instance.getConnections().length })
}

export const getTotalPages = (req, res) => {
	res.json({ total: Manager.instance.getList().length })
}

export const getPublishedPage = (req, res) => {
	res.json({ total: Manager.instance.getListWithStatusOnFolder('publish').length })
}
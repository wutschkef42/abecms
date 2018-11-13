import { config } from '../../../cli'

export const getWorkflows = (req, res) => {
	return res.status(200).json({
		workflows: config.users.workflow
	})
}
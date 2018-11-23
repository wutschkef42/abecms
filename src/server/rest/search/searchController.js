import { User } from '../../../cli'


export const saveSearch = (req, res) => {
	if (req.body.title != null && req.body.title != null != '' && req.body.search != null && req.body.search != '') {
		User.operations.saveSearch(req.body.id, {
			"title": req.body.title,
			"search": req.body.search
		})
		return res.status(200).json({success: 1})
	}
	
	return res.status(400).json({success: 0})
}

export const removeSearch = (req, res) => {
	if(req.body.title != null && req.body.title != null != '' && req.body.search != null && req.body.search != '') {
    	User.operations.removeSearch(req.body.id, {
			"title": req.body.title,
			"search": req.body.search
		})
    	return res.status(200).json({ success: 1 })
	}

	return res.status(400).json({ success: 0 })
}
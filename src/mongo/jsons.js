const { saveOne } = require('./crud')

class JsonData {
	constructor ({ _id, path, filename, json, mtime, pathArray } = {}) {
		this.id = _id || null
		this._id = _id || null
		this.filename = filename || 'Filename'
		this.json = json || {}
		this.mtime = mtime || 0
		this.path = path || ''
		this.pathArray = pathArray || (path !== "") ? path.split('/').slice(0, -1) : null
	}

	save () {
		saveOne('jsons', this);
	}
}

module.exports = JsonData;
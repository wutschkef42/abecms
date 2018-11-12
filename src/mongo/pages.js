const { saveOne } = require('./crud')

class Page {
	constructor ({ _id, path, filename, json, mtime, pathArray, template } = {}) {
		this.id = _id || null
		this._id = _id || null
		this.filename = filename || 'Filename'
		this.json = json || {}
		this.mtime = mtime || 0
		this.path = path || ''
		this.template = template
		this.pathArray = pathArray || (path !== "") ? path.split('/').slice(0, -1) : null
	}

	save () {
		saveOne('pages', this);
	}
}

module.exports = Page;
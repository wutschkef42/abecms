const { saveOne } = require('./crud')

class Template {
	constructor ({ _id, name, path } = {}) {
		this.id = _id || null
		this._id = _id || null
		this.template = template || '<html><head></head><body>Empty</body></html>'
		this.path = path || 'path'
		this.name = name || 'name'
	}

	save () {
		saveOne('templates', this);
	}
}

module.exports = Template
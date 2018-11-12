const { saveOne } = require('./crud')

class Role {
	constructor ({ _id, name, workflow } = {}) {
		this.id = _id || null
		this._id = _id || null
		this.name = name || ''
		this.workflow = workflow || ''
	}

	save () {
		saveOne('roles', this);
	}
}

module.exports = Role;
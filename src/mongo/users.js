const { saveOne } = require('./crud')

class User {
	constructor ({ _id, name, username, email, password, role, uid, actif, avatar } = {}) {
		this.id = _id || null
		this._id = _id || null
		this.name = name || 'Name'
		this.username = username || 'username'
		this.email = email || 'email@dot.com'
		this.password = password || 'Adm1n@test'
		this.role = role || null
		this.uid = uid || -1
		this.actif = actif || 0 
		this.avatar = avatar || ''
	}

	save () {
		saveOne('users', this);
	}
}

module.exports = User
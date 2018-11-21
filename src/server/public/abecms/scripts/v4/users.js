var usersList = new Vue({
	el: '#users-list',
	delimiters: ['${', '}'],
	data: { 
		users: [],
		currentUser: {},
		currentIndex: -1,
		currentRole: 'No',
		message: 'Coucou',
		roles: [
			{ name: 'Admin', workflow: 'admin'},
			{ name: 'Writer', workflow: 'writer'}
		],
		userForm: {
			role: '',
		},
		showSuccessUpdate: false,
		removeIndex: -1,
		removeUserData: {},
		newUser: {
			name: '',
			username: '',
			role: null,
			roleString: '',
			email: '',
			password: '',
		},
		showSuccessAdd: false,
		showErrorAdd: false,
		textErrorAdd: '',
	},
	computed: {
		usersList() {
			return this.users
		}
	},
	methods: {
		openModifyModal (id) {
			console.log(id)
			for (var i in this.users) {
				if (this.users[i].id === id) {
					this.currentIndex = i;
					this.currentUser = this.users[i]
					this.currentRole = (this.currentUser.role.name)
					this.userForm = JSON.parse(JSON.stringify(this.currentUser))
					this.userForm.password = null
					this.userForm.role = this.currentUser.role.name;
					console.log(this.currentUser.role)
					break ;
				}
			}
			$('#modifyModal').modal('show')
		},
		onAddUserSubmit (evt) {
			evt.preventDefault();
			var self = this
			var { password, username, name, email, role, roleString } = this.newUser
			if (typeof roleString === 'string') {
				for (var i in this.roles) {
					if (this.roles[i].name == roleString) {
						role = this.roles[i]
						this.newUser.role = role;
					}
				}
			}
			axios({
				url: '/abe/api/users',
				method: 'POST',
				data: {
					username: username,
					name: name,
					email: email,
					role: role,
					password: password,
				}
			})
			.then(function (res) {
				self.users.push(res.data.user)
				console.log(res.data)
			})
			.catch (function (err) {
				self.handleErrorAdd(err)
			})
		},
		onUpdateUserSubmit (evt) {
			evt.preventDefault();
			var self = this
			console.log(this.userForm.role)
			var { username, name, email, role, id } = this.userForm
			if (typeof role === 'string') {
				for (var i in this.roles) {
					if (this.roles[i].name == role) {
						role = this.roles[i]
						this.userForm.role = role;
					}
				}
			}
			axios({
				url: '/abe/api/users',
				method: 'PUT',
				data: {
					id: id,
					username: username,
					name: name,
					email: email,
					role: role,
				}
			})
			.then(function(res) {
				self.updateUsersMore(id, self.userForm)
				self.showSuccessUpdate = true;
				setTimeout(function () {
					self.showSuccessUpdate = false
				}, 3000)
				console.log(res.data)
			}).catch(function(err) {
				console.log(err)
			})
		},
		deactivateUser (id) {
			var self = this
			axios({
				url: '/abe/api/users/deactivate',
				method: 'PUT',
				data: {
					id: id,
				}
			})
			.then(function(res) {
				self.updateUsers(id, 'actif', 0)
				console.log(res.data)
			})
			.catch(function(err) {
				console.log(err)
			})
		},
		activateUser (id) {
			var self = this
			axios({
				url: '/abe/api/users/activate',
				method: 'PUT',
				data: {
					id: id,
				}
			})
			.then(function(res) {
				self.updateUsers(id, 'actif', 1)
				console.log(res.data)
			})
			.catch(function(err) {
				console.log(err)
			})
		},
		updateUsers (id, prop, val) {
			const users = this.users;
			for (var i in users) {
				if (users[i].id === id) {
					users[i][prop] = val;
				}
			}
			this.users = users;
		},
		updateUsersMore (id, props) {
			const users = this.users;
			for (var i in users) {
				if (users[i].id === id) {
					for (var prop in props) {
						users[i][prop] = props[prop];
					}
				}
			}
			this.users = users;
		},
		askRemoveUser (id) {
			for (var i in this.users) {
				if (this.users[i].id === id) {
					this.removeIndex = i;
					this.removeUserData = this.users[i]
				}
			}
			$('#removeModal').modal('show')
		},
		handleErrorAdd (err) {
			this.showErrorAdd = true
			if (err.response) {
				this.textErrorAdd = err.response.data.message
			} else {
				this.textErrorAdd = 'No connection ?'
			}
		},
		tryRemoveUser (id) {
			var self = this
			console.log('request for remove user', id)
			axios({
				url: '/abe/api/users/' + id,
				method: 'DELETE'
			})
			.then(function(res) {
				self.removeUser(id)
				console.log(res.data)
			})
			.catch(function(err) {
				console.log(err)
			})
		},
		removeUser (id) {
			var users = this.users;
			for (var i in users) {
				if (users[i].id == id) {
					delete users[i]
				}
			}
			this.users = users;
			this.users.push()
			this.users.pop()
		},
		openAddUser () {
			$('#addModal').modal('show')
		}
	},
	created () {
		var self = this;
		axios({
			url: '/abe/api/users',
		}).then(function(res) {
			for (var i in res.data.users) {
				self.users.push(res.data.users[i])
			}
		}).catch(function(err) {
			console.log(err)
		})
		axios({
			url: '/abe/api/roles',
		}).then(function(res) {
			self.roles = res.data.roles
		}).catch(function(err) {
			console.log(err)
		})
	}
})

Vue.component('profile-img', {
	props: {
		avatar: String,
	},
  	template: '<span><img style="height:42px;" :src="avatar" alt="Profile Picture" /></span>'
})
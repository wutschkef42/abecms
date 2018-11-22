var permissionsApp = new EngineV4({
	el: '#permissions',
	delimiters: ['${', '}'],
	data: {
		roles: [],
		urls: [],
		perms: {},
		permissions: {},
		showSuccessAlert: false,
	},
	methods: {
		savePermissions () {
			// first thing is too prepare data for sending.
			// We only get checked things for non-admin roles
			var checks = {};
			var perms = this.perms;
			for(var url in perms) {
				var perm = perms[url]
				for (var role in perm.roles) {
					if (role != "admin" && perm.roles[role] == true) {
						if (!checks[role]) {
							checks[role] = []
						}
						checks[role].push(perm.regex)
					}
				}
			}
			var self = this;
			AjaX({
				url: '/abe/api/urls',
				method: 'POST',
				data: checks,
			}).then(function (res) {
				self.showSuccessAlert = true
				setTimeout(function() {
					self.showSuccessAlert = false;
				})
			}).catch(function (err) {
				console.log(err)
			})
		},
		isDisabled (role) {
			return (role == 'admin' ? true : false)
		}
	},
	created () {
		var self = this;
		AjaX({
			url: '/abe/api/urls'
		}).then(function (res) {
			self.perms = res.data.perms
			self.permissions = res.data.permissions
			self.urls = res.data.urls

		}).catch(function (err) {
			console.log('error')
			console.log(err)
		})
		AjaX({
			url: '/abe/api/roles'
		}).then(function (res) {
			self.roles = res.data.roles

		}).catch(function (err) {
			console.log(err)
		})
	}
})
var referencesApp = new Vue({
	el: '#references',
	delimiters: ['${', '}'],
	data: {
		list: [],
		references: {},
		jsonToShow: '',
		jsonName: '',
		showing: false,
		newReference: '',
		showSaveSuccess: false,
	},
	methods: {
		getList () {
			var self = this;
			axios({
				url: '/abe/api/references'
			})
			.then(function(res) {
				self.list = res.data.references
			})
			.catch(function(err) {

			})
		},
		getReference (name) {
			var self = this;
			axios({
				url: '/abe/api/references/' + name,
			})
			.then(function(res) {
				const references = self.references;
				references[name] = res.data
				self.references = references
				self.jsonToShow = JSON.stringify(res.data, null, 2)
				self.jsonName = name;
				self.showing = true;
			})
			.catch(function(err) {
				console.log(err)
			})
		},
		saveReference () {
			this.updateReference(this.jsonName, this.jsonToShow)
		},
		updateReference (filename, json) {
			var self = this;
			axios({
				url: '/abe/api/references',
				method: 'POST',
				data: {
					url: filename,
					json: json
				}
			})
			.then(function(res) {
				self.showSaveSuccess = true
				setTimeout(function() {
					self.showSaveSuccess = false
				}, 2000)
			})
			.catch(function(err) {
				console.log(err)
			})
		},
		createReference (filename) {
			var self = this
			axios({
				url: '/abe/api/references',
				method: 'POST',
				data: {
					url: filename,
					json: JSON.stringify({})
				}
			})
			.then(function(res) {
				self.list.push(filename)
			})
			.catch(function(err) {
				console.log(err.data)
			})
		},
		addReference () {
			let filename = this.newReference;
			if (filename.indexOf('.json') === -1) {
				filename = filename + '.json'
			}
			this.createReference(filename)
		},
		loadReference (name) {
			this.getReference(name)
		},
		closeEditor () {
			this.showing = false
		}
	},
	created () {
		
		var self = this
		axios({
			url: '/abe/api/references'
		})
		.then(function(res) {
			self.references = res.data.references
			console.log(res.data)
		})
		.catch(function(err) {
			console.log(err)
		})
	}
})
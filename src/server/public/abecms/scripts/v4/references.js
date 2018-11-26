var refsList = $('#refs-list')
var nameInput = $('#ref-filename')
var editorcol = $('#editorcol')
var filename = $('#filename')
var filename2 = $('#filename2')
var successAlert = $('#successalert')

editorcol.hide()
successAlert.hide()

var references;

document.loadReference = loadReference;
document.saveReference = saveReference;

function createReferenceListItem (refer) {
	console.log(refer)
	var htmlStuff = `
	<a href="#" class="list-group-item list-group-item-action" onclick="loadReference('${ refer }')">
		${ refer }
	</a>`

	return $(htmlStuff)
}

function generateList () {
	for (var i in references) {
		var ref = references[i]
		refsList.append(createReferenceListItem(ref))
	}
}

function addReference() {
	let filename = nameInput.val()
	if (filename.indexOf('.json') === -1) {
		filename = filename + '.json'
	}
	createReference(filename)
}

function createReference (filename) {
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
}

function getReference(name) {
	var self = this;
	$.ajax({
		url: '/abe/api/references/' + name,
	})
	.done(function(res) {
		console.log(res)
		$('#jsonToShow').val(JSON.stringify(res, null, 2))
	})
	.fail(function(err) {
		console.log(err)
	})
}

function loadReference (name) {
	editorcol.show()
	filename.html(name)
	filename2.html(name)
	getReference(name)
}

function saveReference () {
	updateReference(filename.html(), $('#jsonToShow').val())
}

function updateReference (filename, json) {
	$.ajax({
		url: '/abe/api/references',
		method: 'POST',
		data: {
			url: filename,
			json: json
		}
	})
	.done(function(res) {
		successAlert.show()
		setTimeout(function() {
			successAlert.hide()
		}, 2000)
		
	})
	.fail(function(err) {
		console.log(err)
	})
}

function initReferences () {
	$.ajax({
		url: '/abe/api/references'
	})
	.done(function(res) {
		references = res.references
		generateList()
		console.log(references)
	})
	.fail(function(err) {
		console.log(err)
	})
}

initReferences()


/*
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
*/
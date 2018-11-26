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
	$.ajax({
		url: '/abe/api/references',
		method: 'POST',
		data: {
			url: filename,
			json: JSON.stringify({})
		}
	})
	.done(function(res) {
		self.list.push(filename)
	})
	.fail(function(err) {
		console.log(err.data)
	})
}

function getReference(name) {
	var self = this;
	$.ajax({
		url: '/abe/api/references/' + name,
	})
	.done(function(res) {
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
	})
	.fail(function(err) {
		console.log(err)
	})
}

initReferences()

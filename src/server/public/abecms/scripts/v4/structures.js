var structuresListCleaned = []

function pathToId (path) {
	return path.replace(/\//g, '_');
}

function getStructures () {
	$('#list-structures').empty();
	$.ajax({
		method: "GET",
		url: REST_URL + "/structures",
	  })
	  .done(function( msg ) {
			var structures = JSON.parse(msg);
			for (var i in structures) {
				console.log(structures[i])
				structuresListCleaned.push({ path: structures[i].path, folders: structures[i].folders })
				$('#list-structures').append('<li class="list-group-item item-structure" id="'+pathToId(structuresListCleaned[i].path)+'" onclick="clickOnItemStructure(this, \''+structuresListCleaned[i].path+'\')">'+structuresListCleaned[i].path+'<button type="button" class="btn btn-danger float-right" onclick="deleteStructure(\''+structuresListCleaned[i].path+'\')"><span class="cui-delete"></span> </button></li>')
			}
			
	  })
	  .fail(function (err) {
			console.log(err);
	  })
}

function postStructure (folderPath) {
	$.ajax({
		method: "POST",
		url: REST_URL + "/structures",
		data: {
		  folderPath: folderPath,
		}
	})
	.done(function( msg ) {
		console.log( msg );
		$('#list-structures').append('<li class="list-group-item" id="'+pathToId(folderPath)+'" onclick="clickOnItemStructure(this, \''+folderPath+'\')">'+folderPath+'<button type="button" class="btn btn-danger float-right" onclick="deleteStructure(\''+folderPath+'\')"><span class="cui-delete"></span> </button></li>')
	})
	.fail(function (err) {
		console.log(err);
	})
}

function getStructureByPath (path) {
	console.log(path);
	$.ajax({
		method: "GET",
		url: REST_URL + "/structures/" + path,
	})
	.done(function( msg ) {
		console.log(msg);
	})
	.fail(function (err) {
		console.error(err);
	})
}

function deleteStructure (folderPath) {
	$.ajax({
		method: "DELETE",
		url: REST_URL + "/structures",
		data: {
		  folderPath: folderPath,
		}
	  })
	  .done(function( msg ) {
			$('#' + pathToId(folderPath)).remove()
			console.log( msg );
	  })
	  .fail(function (err) {
		console.log(err);
	  })
}

function clickOnItemStructure (obj, path) {
	
	$('#sub-structures').empty();

	$('#selected-structure').html(path);
	for (var i in structuresListCleaned) {
		if (structuresListCleaned[i].path == path) {
			var folders = structuresListCleaned[i].folders
			for (var i in folders) {
				$('#sub-structures').append('<li class="list-group-item" id="'+pathToId(folders[i].path)+'">'+folders[i].path+'<button type="button" class="btn btn-danger float-right" onclick="deleteStructure(\''+folders[i].path+'\')"><span class="cui-delete"></span> </button></li>')
			}
		}
	}
}

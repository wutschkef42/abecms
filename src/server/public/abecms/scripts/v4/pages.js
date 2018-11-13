function paginateManager () {
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
				$('#list-structures').append('<li class="list-group-item item-structure" onclick="clickOnItemStructure(this, \''+structuresListCleaned[i].path+'\')">'+structuresListCleaned[i].path+'</li>')
			}
			
	  })
	  .fail(function (err) {
			console.log(err);
	  })
}
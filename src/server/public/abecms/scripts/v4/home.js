function setTotalUsers(total) {
	$('#statTotalUsers').html(total)
}

function setTotalPages(total) {
	$('#statTotalPages').html(total)
}

function setConnectedUser(total) {
	$('#statConnectedUser').html(total)
}

function setPublishedPages(total) {
	$('#statPublishedPages').html(total)
}

$(document).ready(function () {

	$.ajax({
		url: '/abe/api/stats/users/total',
	}).done(function(data) {
		if (data.total) {
			setTotalUsers(data.total)
		}
	})

	$.ajax({
		url: '/abe/api/stats/users/connected',
	}).done(function(data) {
		if (data.total) {
			setConnectedUser(data.total)
		}
	})

	$.ajax({
		url: '/abe/api/stats/pages/total',
	}).done(function(data) {
		if (data.total) {
			setTotalPages(data.total)
		}
	})

	$.ajax({
		url: '/abe/api/stats/pages/published',
	}).done(function(data) {
		if (data.total) {
			setPublishedPages(data.total)
		}
	})

})


var usersList = $('#users-list')
var listBody = $('#list-body')

var usersElements = []
var roles = []
var users = {}

var removeUserIndex = -1;
var removeUserId = -1;

var updateIndex = -1;
var updateId = -1;
function getUpdateId () {
	return updateId
}
function setUpdateId (id) {
	updateId = id
}

$('#alertAddError').hide()
$('#alertAddSuccess').hide()
$( "#alertModifyError" ).hide();


initUsersList()

function createUserItem (user) {

	var htmlStuff = `<tr in usersList" id="${user.id}">
	<td><span><img style="height:42px;" src="${user.avatar}" alt="Profile Picture" /></span></td>
	<td class="cell-user">${ user.username }</td>
	<td class="cell-user">${ user.name }</td>
	<td class="cell-user">${ user.email }</td>
	<td class="cell-user">${ user.role.name }</td>
	<td class="cell-user">
		${ (user.actif) ? `<span class="fas fa-eye-slash icon-deactivate text-danger" onclick="deactivateUser(${user.id})" data-toggle="tooltip" data-placement="top" title="Deactivate the user"></span>` : `<span class="fas fa-eye icon-activate text-info" onclick="activateUser(${user.id})" data-toggle="tooltip" data-placement="top" title="Activate the user"></span>` }
	</td>
	<td class="cell-user">
		<span class="fas fa-pencil-alt text-primary icon-action"  onclick="openModifyModal(${user.id})"></span>&nbsp;&nbsp;
		<span class="fas fa-trash text-danger icon-action" onclick="askRemoveUser(${user.id})"></span>
	</td>
</tr>`

	return $(htmlStuff)
}

function generateList () {
	listBody.empty()
	for (var i in users) {
		listBody.append(createUserItem(users[i]))
	}
}

function deactivateUser (id) {
	$.ajax({
		url: '/abe/api/users/deactivate',
		method: 'PUT',
		data: {
			id: id,
		}
	})
	.done(function(res) {
		users[findIndexWithId(id)].actif = 0;
		generateList()

	})
	.fail(function(err) {
		console.log(err)
	})
}

function findIndexWithId (id) {
	for (var i in users) {
		if (users[i].id === id) {
			return i
		}
	}
}

function onAddUserSubmit () {
	var role = {}
	var password = $('#inputAddPassword').val()
	var username = $('#inputAddUsername').val()
	var name = $('#inputAddName').val()
	var email = $('#inputAddEmail').val()
	var roleString = $('#inputAddRole').val()

	if (typeof roleString === 'string') {
		for (var i in roles) {
			if (roles[i].name == roleString) {
				role = roles[i]
			}
		}
	}

	$.ajax({
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
	.done(function (res) {
		users.push(res.user)
		generateList()
		
		closeAddUser()
	})
	.fail (function (err) {
		console.log(err)
		handleErrorAdd(err)
	})
}

function onUpdateUserSubmit () {
	
	var role = {}
	var id = getUpdateId()
	var username = $('#inputModifyUsername').val()
	var name = $('#inputModifyName').val()
	var email = $('#inputModifyEmail').val()
	var roleString = $('#inputModifyRole').val()

	if (typeof roleString === 'string') {
		for (var i in roles) {
			if (roles[i].name == roleString) {
				role = roles[i]
			}
		}
	}

	$.ajax({
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
	.done(function(res) {
		updateUsersMore(id, { username, name, email, role })
		setTimeout(function () {
			// self.showSuccessUpdate = false
		}, 3000)
		$('#modifyModal').modal('hide')
	}).fail(function(err) {
		console.log(err)
	})
}

function activateUser (id) {
	$.ajax({
		url: '/abe/api/users/activate',
		method: 'PUT',
		data: {
			id: id,
		}
	})
	.done(function(res) {
		users[findIndexWithId(id)].actif = 1;
		generateList()
	})
	.fail(function(err) {
		console.log(err)
	})
}

function updateUsers (id, prop, val) {
	const users = this.users;
	for (var i in users) {
		if (users[i].id === id) {
			users[i][prop] = val;
		}
	}
	this.users = users;
}

function initUsersList() {
	$.ajax({
		url: '/abe/api/users'
	}).done(function (res) {
		users = res.users
		generateList()
	}).fail(function (err) {
		console.log(err);
	});

	$.ajax({
		url: '/abe/api/roles'
	}).done(function (res) {
		roles = res.roles;
		generateRolesList()
	}).fail(function (err) {
		console.log(err);
	});
}

function askRemoveUser (id) {
	for (var i in users) {
		if (users[i].id === id) {
			removeUserIndex = i;
			removeUserId = users[i].id
			generateDeleteModal (i, users[i])
			break ;
		}
	}
	$('#removeModal').modal('show')
}

function tryRemoveUser (id) {
	$.ajax({
		url: '/abe/api/users/' + id,
		method: 'DELETE'
	})
	.done(function(res) {
		delete users[removeUserIndex]
		generateList()
		closeDeleteUser()
	})
	.fail(function(err) {
		console.log(err)
	})
}

function generateDeleteModal (index, data) {
	$('#mr-username').html(data.username)
	$('#mr-username2').html(data.username)
	$('#mr-name').html(data.name)
	$('#mr-email').html(data.email)
}

function openAddUser () {
	$('#addModal').modal('show')
}

function closeAddUser () {
	$('#addModal').modal('hide')
}

function closeDeleteUser () {
	$('#removeModal').modal('hide')
}

function generateRolesList () {
	for (var i in roles) {
		$('#inputAddRole').append($(`<option value="${roles[i].name}">${ roles[i].name }</option>`))
		$('#inputModifyRole').append(`<option value="${roles[i].name}">${roles[i].name}</option>`)
	}
}

$('#addUserForm').on('submit', function (evt) {
	evt.preventDefault();
	onAddUserSubmit()
})

$('#removeUserConfirmButton').on('click', function(evt) {
	tryRemoveUser(removeUserId)
})

function openModifyModal (id) {
	for (var i in users) {
		if (parseInt(users[i].id) === parseInt(id)) {
			var data = users[i]
			$('#inputModifyEmail').val(data.email)
			$('#inputModifyUsername').val(data.username)
			$('#inputModifyName').val(data.name)
			$('#inputStringRole').html(data.role.name)
			$('#inputStringUsername').html(data.username)
			updateIndex = i;
			updateId = id;
			setUpdateId(id)
			break ;
		}
	}
	$('#modifyModal').modal('show')
}

$('#formUserUpdate').on('submit', function(evt) {
	evt.preventDefault();
	onUpdateUserSubmit()
})

function updateUsersMore (id, props) {	
	for (var i in users) {
		if (parseInt(users[i].id) === parseInt(id)) {
			for (var prop in props) {
				users[i][prop] = props[prop];
			}
		}
	}
	generateList()
}

function handleErrorAdd (err) {
	console.log(err)
	$( "#textErrorAdd" ).html()
	$( "#alertAddError" ).show();
	if (err.responseJSON) {
		$('#textErrorAdd').html(err.responseJSON.message)
	} else {
		$('#textErrorAdd').html('No connection ?')
	}
}

function handleErrorModify (err) {
	console.log(err)
	$( "#textErrorModify" ).html()
	$( "#alertModifyError" ).show();
	if (err.responseJSON) {
		$('#textErrorModify').html(err.responseJSON.message)
	} else {
		$('#textErrorModify').html('No connection ?')
	}
}

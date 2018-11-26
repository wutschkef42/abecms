var headList = $('#headlist')
var permiBody = $('#permissions-list')
var successAlert = $('#success-alert')

successAlert.hide()

var roles;
var perms;
var urls = []
var roles = []

var checkChange = function (name, url, checkbox) {
	perms[url].roles[name] = checkbox.checked
}

document.checkChange = checkChange
document.savePermissions = savePermissions


function createPermissionItem (perm, url) {
	var htmlStuff = `<tr v-for="(perm, url) in perms">
	<td>${ perm.method }</td>
	<td>${ url }</td>
	${ createCheckboxesHTML(perm.roles, url) }
</tr>`

	return $(htmlStuff)
}

function createCheckboxesHTML (roles, url) {
	var htmlStuff = ``
	for (var name in roles) {
		var role = roles[name]
		console.log(name, role, url)
		htmlStuff = `${htmlStuff}<td>
		<div class="permission-box">
			<input class="permission-checkbox" onclick="checkChange('${name}','${url}', this)" ${ role ? 'checked' : ''} type="checkbox" ${ name == 'admin' ? 'disabled="true"' : '' }>
		</div>
	</td>`
	}
	return htmlStuff
}

function savePermissions () {
	// first thing is too prepare data for sending.
	// We only get checked things for non-admin roles
	var checks = {};
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
	$.ajax({
		url: '/abe/api/urls',
		method: 'POST',
		data: checks,
	}).done(function (res) {
		alert('Permissions saved!')
		successAlert.show()
		setTimeout(function() {
			successAlert.hide()
		})
	}).fail(function (err) {
		console.log(err)
	})
}

function initData () {
	urls = Object.keys(perms)
	roles = Object.keys(perms[urls[0]].roles)
	console.log(urls, roles)
}

function createTable () {
	permiBody.empty()
	for (var url in perms) {
		permiBody.append(createPermissionItem(perms[url], url))
	}
}

function createHead () {
	for (var i in roles) {
		var role = roles[i]
		headList.append($(`<th align="center" class="text-center">${ role }</th>`))
	}
}

function loadPermissions () {
	$.ajax({
		url: '/abe/api/urls'
	}).done(function (res) {
		perms = res.perms
		initData()
		createHead()
		createTable()

	}).fail(function (err) {
		console.log('error')
		console.log(err)
	})
}



loadPermissions()

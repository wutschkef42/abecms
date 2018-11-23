import Nanoajax from 'nanoajax'



var _ajax = Nanoajax.ajax
var loginForm = document.getElementById('loginForm')
var loginButton = document.getElementById('loginButton')

if (loginForm) {
	loginForm.addEventListener('submit', function(evt) {
		evt.preventDefault();
		tryLogin(evt);
	})
}

var forgotForm = document.getElementById('forgotForm')
var forgotButton = document.getElementById('forgotButton')

if (forgotForm) {
	forgotForm.addEventListener('submit', function(evt) {
		evt.preventDefault();
		tryForgot(evt);
	})
}

function tryLogin (evt) {
	var username = document.getElementById('loginUsername').value
	var password = document.getElementById('loginPassword').value
	var _csrf = document.getElementsByName('_csrf')[0].value
	document.getElementById('error-message').style.display = 'none'

	loginButton.innerHTML = 'Connecting...'
	loginButton.disabled = true;

	if (!username || !password || !_csrf) {
		
		return ;
	}

	var dataToSend = JSON.stringify({
		username: username,
		password: password,
		_csrf: _csrf,
	})

	_ajax({
		url: '/abe/api/users/login',
		body: dataToSend,
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'post'
	}, (e, res) => {
		if (res) {
			var rjson = JSON.parse(res)
			loginButton.innerHTML = 'Login'
			loginButton.disabled = false;
			if (rjson.error && rjson.message) {
				writeErrorMessage(rjson.message)
			} else {
				location.href='/abe'
			}
		}	
	})
}

function writeErrorMessage (msg) {
	document.getElementById('error-message').style.display = 'block'
	document.getElementById('error-message').innerHTML = msg + '<br /><br />'
}

function writeErrorMessageForgot (msg) {
	document.getElementById('error-message').style.display = 'block'
	document.getElementById('error-message').innerHTML = msg + '<br /><br />'
}

function writeSuccessForgot (msg) {
	document.getElementById('success-message').style.display = 'block'
	document.getElementById('success-message').innerHTML = msg + '<br /><br />'
}


function tryForgot (evt) {
	var email = document.getElementById('forgotEmail').value
	var _csrf = document.getElementsByName('_csrf')[0].value
	document.getElementById('success-message').style.display = 'none'

	if (!email) {
		return ;
	}

	forgotButton.innerHTML = 'Connecting...'
	forgotButton.disabled = true;


	var dataToSend = JSON.stringify({
		email: email,
		_csrf: _csrf,
	})

	_ajax({
		url: '/abe/api/users/forgot',
		body: dataToSend,
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'post'
	}, (e, res) => {
		if (res) {
			var rjson = JSON.parse(res)
			forgotButton.innerHTML = 'Login'
			forgotButton.disabled = false;
			if (rjson.error && rjson.message) {
				writeErrorMessageForgot(rjson.message)
			} else {
				writeSuccessForgot(rjson.message)
			}
		}	
	})
}

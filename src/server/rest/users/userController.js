import { User, config, Manager, Handlebars, coreUtils } from '../../../cli'

const Joi = require('joi');

import crypto from 'crypto'
import Cookies from 'cookies'
import passport from 'passport'
import jwt from 'jwt-simple'
import moment from 'moment'

import {
	updateUserSchema,
	createUserSchema,
	activeUserSchema,
} from './userValidation';

const buildResponse = (statusCode, data, res) => {
  if (statusCode === 200) {
    return res.status(200).json({
      data
    });
  } else {
    return res.status(statusCode).json(data);
  }
}

export const createUser = async (req, res) => {
	const validation = Joi.validate(req.body, createUserSchema);

	if (validation.error !== null) {
		return res.status(400).json({ message: 'validation', details: validation.error.details })
	}

  const resultCreate = User.operations.add(req.body)
  


	if (resultCreate.success === false) {
		return res.status(400).json({ message: resultCreate[resultCreate.error].message })
	}

	res.json(resultCreate)
}

export const updateUser = async (req, res) => {
	const validation = Joi.validate(req.body, updateUserSchema);

	if (validation.error !== null) {
		return res.status(400).json({ message: 'validation', details: validation.error.details })
	}

	const resultUpdate = User.operations.update(req.body)

	console.log(resultUpdate);

	if (resultUpdate.success === 0) {
		return res.status(400).json({ message: resultUpdate.message })
	}

	res.status(200).json(resultUpdate)
};



export const removeUser = (req, res) => {

	if (!req.body.id && !req.params.id) {
		return res.status(400).json({ message: 'id needed' })
  } 

  const id = req.body.id ? req.body.id : req.params.id

	const removeResult = User.operations.remove(id)

	buildResponse(200, { success: true, userlist: removeResult }, res)
};

// Done above
// Todo en dessous

export const listUsers = (req, res) => {
	buildResponse(200, User.utils.getAll(), res)
}

export const activateUser = (req, res) => {
	if (!req.body.id) {
		return res.status(400).json({ message: 'id needed' })
	}
	User.operations.activate(req.body.id)
	buildResponse(200, {success: true}, res)
}

export const deactivateUser = (req, res) => {
	if (!req.body.id) {
		return res.status(400).json({ message: 'id needed' })
	}
	User.operations.deactivate(req.body.id)
	buildResponse(200, {success: true}, res)
}

export const getMe = (req, res) => {
	const user = res.user;
  
	if (!user) {
	  buildResponse(401, req.err, res);
	} else {
	  buildResponse(200, user, res);
	}
};

export const tryLogin = (req, res, next) => {
	User.utils.loginLimitTry(req.body.username).then(limit => {
    if (limit != null) {
      // all good
      if (!limit.remaining) {
        req.flash('info', 'Rate limit exceeded')
        return res.status(401).json({ message: 'Too much login, wait please', error: 'toologin' })
      }
    }

    passport.authenticate('local', {session: false}, function(err, user, info) {
      var secret = config.users.secret
      if (err) {
        return next(err)
      }

      if (!user) {
        req.flash('info', info.message)
        return res.status(400).json({ error: 'badlogin', message: 'No user found with these credentials' })
      }
      var expires = moment().add(7, 'days').valueOf()
      var token = jwt.encode(
        {
          iss: user.id,
          exp: expires,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        },
        secret
      )

      var cookies = new Cookies(req, res, {
        secure: config.cookie.secure
      })
      cookies.set('x-access-token', token)

      var username = ''
      if (user && user.username) {
        username = user.username
      }
      Manager.instance.events.activity.emit('activity', {
        operation: 'connect',
        post: '',
        user: username
      })
      res.status(200).json({ token })
    })(req, res, next)
  })
}

export const forgotPassword = (req, res) => {
  if (typeof req.body.email !== 'undefined' && req.body.email !== null) {
    User.utils.findByEmail(req.body.email, function(err, user) {
      if (err) {
        return res.status(500).json({success: 0, error: 'server', message: 'Server error', err: err })
      }

      if (!user) {
        return res.status(400).json({success: 0, error: 'nouser', message: 'No user found'})
      }

      crypto.randomBytes(20, function(err, buf) {
        var resetPasswordToken = buf.toString('hex')
        var forgotExpire = config.forgotExpire

        User.operations.update({
          id: user.id,
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpires: Date.now() + forgotExpire * 60 * 1000
        })

        var requestedUrl =
          req.protocol +
          '://' +
          req.get('Host') +
          '/abe/users/reset?token=' +
          resetPasswordToken

        var emailConf = config.users.email
        html = emailConf.html || ''

        if (
          typeof emailConf.templateHtml !== 'undefined' &&
          emailConf.templateHtml !== null
        ) {
          var fileHtml = path.join(config.root, emailConf.templateHtml)
          if (coreUtils.file.exist(fileHtml)) {
            html = fs.readFileSync(fileHtml, 'utf8')
          }
        }

        var template = Handlebars.compile(html, {noEscape: true})

        html = template({
          express: {
            req: req,
            res: res
          },
          forgotUrl: requestedUrl,
          siteUrl: req.protocol + '://' + req.get('Host'),
          user: user
        })

        var from = emailConf.from
        var to = user.email
        var subject = emailConf.subject
        var text = emailConf.text.replace(/\{\{forgotUrl\}\}/g, requestedUrl)
        var html = html.replace(/\{\{forgotUrl\}\}/g, requestedUrl)

        coreUtils.mail.send(from, to, subject, text, html)
        return res.status(200).json({success: 1, message: 'Check your inbox'})
      })
    })
  }
}


export const getProfile = (req, res) => {
  var userEditable = JSON.parse(JSON.stringify(res.user))
  delete userEditable.password
  delete userEditable.role
  delete userEditable.id
  delete userEditable.actif

  return res.status(200).json({
		user: userEditable
	})
}

export const postProfile = (req, res) => {
	const decoded = User.utils.decodeUser(req, res)
  const user = User.utils.findSync(decoded.iss)
  const body = req.body

  if (
    body.oldpassword != null &&
    body.oldpassword != '' &&
    body.password != null &&
    body.password != '' &&
    body['repeat-password'] != null &&
    body['repeat-password'] != ''
  ) {
    if (body.password !== body['repeat-password']) {
      return res.status(400).json({
				message: 'password & confirmation password must be the same',
				error: 'passwordconfirm'
			})
    }

    if (!User.utils.isValid(user, body.oldpassword)) {
      return res.status(400).json({
				message: 'Wrong password',
				error: 'badpassword'
			})
    } else {
      const toUpdate = {
        id: user.id,
        password: body.password,
        username: user.username
      }
      const resultUpdatePassword = User.operations.updatePassword(
        toUpdate,
        toUpdate.password
      )
      if (resultUpdatePassword.success === 0) {
        req.flash('error', resultUpdatePassword.message)
        return res.status(400).json({
					message: resultUpdatePassword.message,
					error: 'badpassword'
				})
      }
    }
  }

  delete body.password
  delete body._csrf
  delete body.oldpassword
  delete body['repeat-password']
  body.id = user.id

	const resultUpdate = User.operations.update(body)
	res.status(200).json({ result: resultUpdate })
}

export const getUsers = (req, res) => {
  const users = User.utils.getAll()
  console.log(users)
	return res.status(200).json({ users })
}

export const logout = (req, res) => {
	var cookies = new Cookies(req, res, {
		secure: config.cookie.secure
	})
	cookies.set('x-access-token', null)

	req.logout()
	res.status(200).json({ success: 1 })
}

export const askPasswordReset = (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({
      error: 'badrequest', message: 'No email in body'
    })
  }
  User.utils.findByEmail(req.body.email, function(err, user) {
    if (err) {
      return res.status(500).json({ error: 'internalerror', message: '#ERR0001' })
    }

    if (!user) {
      return res.status(404).json({ error: 'usernotfound', message: 'User not found' })
    }

    crypto.randomBytes(20, function(err, buf) {
      var resetPasswordToken = buf.toString('hex')
      var forgotExpire = config.forgotExpire

      User.operations.update({
        id: user.id,
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: Date.now() + forgotExpire * 60 * 1000
      })

      var requestedUrl =
        req.protocol +
        '://' +
        req.get('Host') +
        '/abe/users/reset?token=' +
        resetPasswordToken

      var emailConf = config.users.email
      html = emailConf.html || ''

      if (
        typeof emailConf.templateHtml !== 'undefined' &&
        emailConf.templateHtml !== null
      ) {
        var fileHtml = path.join(config.root, emailConf.templateHtml)
        if (coreUtils.file.exist(fileHtml)) {
          html = fs.readFileSync(fileHtml, 'utf8')
        }
      }

      var template = Handlebars.compile(html, {noEscape: true})

      html = template({
        express: {
          req: req,
          res: res
        },
        forgotUrl: requestedUrl,
        siteUrl: req.protocol + '://' + req.get('Host'),
        user: user
      })

      var from = emailConf.from
      var to = user.email
      var subject = emailConf.subject
      var text = emailConf.text.replace(/\{\{forgotUrl\}\}/g, requestedUrl)
      var html = html.replace(/\{\{forgotUrl\}\}/g, requestedUrl)

      coreUtils.mail.send(from, to, subject, text, html)
      return res.status(200).json({ success: true })
    })
  })
}

export const resetPassword = (req, res) => {
  if (
    typeof req.body.token !== 'undefined' &&
    req.body.token !== null &&
    typeof req.body.password !== 'undefined' &&
    req.body.password !== null &&
    typeof req.body['repeat-password'] !== 'undefined' &&
    req.body['repeat-password'] !== null
  ) {
    if (req.body.password !== req.body['repeat-password']) {
      return res.status(400).json({
        error: 'passwordconfirmation',
        message: 'Your passwords are not the same'
      })
    }
    User.utils.findByResetPasswordToken(req.body.token, function(err, userToReset)
    {
      var msg = ''
      if (err) {
        msg = 'Error'
      } else if (typeof userToReset === 'undefined' || userToReset === null) {
        msg = 'Invalid token'
      } else {
        var d = new Date().getTime()
        d = (d - userToReset.resetPasswordExpires) / 1000 / 60
        if (d > 0) {
          msg = 'Token expired'
        }
      }
      if (msg !== '') {
        return res.status(400).json({
          csrfToken: res.locals.csrfToken,
          token: req.body.token,
          message: msg,
          error: 'badrequest'
        })
      }

      userToReset.password = req.body.password
      var resUpdatePassword = User.operations.updatePassword(
        userToReset,
        req.body.password
      )
      if (resUpdatePassword.success === 1) {
        var login = config.users.login
        return res.status(200).json({
          reset: resUpdatePassword,
          login: login,
        })
      } else {
        return res.status(500).json({
          reset: resUpdatePassword
        })
      }
    })
  } else {
    return res.status(400).json({ error: 'badrequest', message: 'Fields token, password and repeat-password are needed', fields: Object.keys(req.body) })
  }
}

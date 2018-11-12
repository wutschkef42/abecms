import { User, config, Manager } from '../../../cli'

const Joi = require('joi');

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

	if (resultCreate.success === 0) {
		return res.status(400).json({ message: resultCreate.message })
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

	res.status(200).json({ message: resultUpdate.message })
};



export const removeUser = (req, res) => {

	if (!req.body.id) {
		return res.status(400).json({ message: 'id needed' })
	}

	const removeResult = User.operations.remove(req.body.id)

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
      req.flash('error', 'password must be the same')
      return res.status(400).json({
				message: 'password & confirmation password must be the same',
				error: 'passwordconfirm'
			})
    }

    if (!User.utils.isValid(user, body.oldpassword)) {
      req.flash('error', '')
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
	return res.status(200).json({ users })
}

export const logout = (req, res) => {
	var cookies = new Cookies(req, res, {
		secure: config.cookie.secure
	})
	cookies.set('x-access-token', null)

	req.logout()
	res.redirect('/abe/users/login')
}

export const askPasswordReset = (req, res) => {

}

export const resetPassword = (req, res) => {

}

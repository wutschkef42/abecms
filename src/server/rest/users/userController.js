import { User } from '../../../cli'
const Joi = require('joi');
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

/* To check
checked
working with res and not req
 */
export const getUser = (req, res) => {
	const user = res.user;
  
	if (!user) {
	  buildResponse(401, req.err, res);
	} else {
	  buildResponse(200, user, res);
	}
};
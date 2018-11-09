import Joi from 'joi';

export const updateUserSchema = {
	id: Joi.required(),
	username: Joi.string().required(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	role: Joi.string().required(),
};

export const createUserSchema = {
	username: Joi.string().required(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	role: Joi.string().required(),
}

export const activeUserSchema = {
	body: {
		id: Joi.required(),
	}
}
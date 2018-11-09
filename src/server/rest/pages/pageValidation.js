import Joi from 'joi';

export const createPageSchema = {
	name: Joi.string().required(),
	template: Joi.string().required(),
}



export const updatePageSchema = {
	id: Joi.required(),
	username: Joi.string().required(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	role: Joi.string().required(),
};

export const unpublishPageSchema = {
	body: {
		id: Joi.required(),
	}
}
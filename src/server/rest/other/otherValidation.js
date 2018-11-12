import Joi from 'joi';

export const saveReferences = {
	url: Joi.string().required(),
	json: Joi.string().required(),
	
};

export const saveConfig = {
	json: Joi.string().required(),
}

export const postStructure = {
	folderPath: Joi.string().required(),
	type: Joi.string().required(),
}
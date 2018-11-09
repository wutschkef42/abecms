import express from 'express';

import {
	updateUserSchema,
	createUserSchema,
	activeUserSchema,
} from './userValidation';

import {
	updateUser,
	removeUser,
	getUser,
	createUser,
	activateUser,
	deactivateUser,
} from './userController';

const router = express.Router();

router.get('/', getUser)
router.post('/', createUser)
router.put('/', updateUser)
router.delete('/', removeUser)
router.put('/activate', activateUser)
router.put('/deactivate', deactivateUser)

export default router

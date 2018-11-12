import express from 'express';

import {
	updateUserSchema,
	createUserSchema,
	activeUserSchema,
} from './userValidation';

import {
	updateUser,
	removeUser,
	getMe,
	createUser,
	activateUser,
	deactivateUser,
	tryLogin,
	getProfile,
	postProfile,
	logout,
	getUsers,
} from './userController';

const router = express.Router();

router.get('/', getUsers)
router.get('/me', getMe)
router.post('/', createUser)
router.put('/', updateUser)
router.delete('/', removeUser)
router.put('/activate', activateUser)
router.put('/deactivate', deactivateUser)
router.post('/login', tryLogin)

router.get('/profile', getProfile)
router.post('/profile', postProfile)

router.get('/logout', logout)

export default router

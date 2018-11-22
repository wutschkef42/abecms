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
	askPasswordReset,
	resetPassword,
} from './userController';

const router = express.Router();

router.get('/users', getUsers)
router.get('/users/me', getMe)
router.post('/users', createUser)
router.put('/users', updateUser)
router.delete('/users', removeUser)
router.delete('/users/:id', removeUser)
router.put('/users/activate', activateUser)
router.put('/users/deactivate', deactivateUser)
router.post('/users/login', tryLogin)

router.get('/users/profile', getProfile)
router.post('/users/profile', postProfile)

router.get('/users/logout', logout)

router.post('/users/askreset', askPasswordReset)
router.post('/users/reset', resetPassword)

export default router

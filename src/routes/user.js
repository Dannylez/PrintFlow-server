import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

router
	.get('/', userController.getAllUsers)
	.get('/:id', userController.getUserById)
	.post('/', userController.createUser)
	.post('/login', userController.login)
	.put('/:id', userController.updateUser)
	.delete('/:id', userController.deleteUser);

export default router;

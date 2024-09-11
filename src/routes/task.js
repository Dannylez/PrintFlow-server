import express from 'express';
import taskController from '../controllers/task.js';

const router = express.Router();

router
	.get('/', taskController.getAllTasks)
	.get('/:id', taskController.getTaskById)
	.post('/', taskController.createTask)
	.put('/:id', taskController.updateTask)
	.delete('/:id', taskController.deleteTask);

export default router;

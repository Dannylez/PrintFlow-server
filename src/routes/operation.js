import express from 'express';
import operationController from '../controllers/operation.js';

const router = express.Router();

router
	.get('/', operationController.getAllOperations)
	.get('/:id', operationController.getOperationById)
	.post('/', operationController.createOperation)
	.put('/:id', operationController.updateOperation)
	.delete('/:id', operationController.deleteOperation);

export default router;

import express from 'express';
import operationController from '../controllers/operation.js';

const router = express.Router();

router
	.get('/', operationController.getAllOperations)
	.get(
		'/filtered',
		operationController.getFilteredOperations
	)
	.get('/:id', operationController.getOperationById)
	.post('/', operationController.createOperation)
	.put('/:id', operationController.updateOperation)
	.delete('/all', operationController.deleteAll)
	.delete('/:id', operationController.deleteOperation);

export default router;

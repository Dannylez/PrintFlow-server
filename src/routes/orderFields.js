import express from 'express';
import orderFieldsController from '../controllers/orderFields.js';

const router = express.Router();

router
	.post('/', orderFieldsController.createFields)
	.put('/:id', orderFieldsController.updateFields);

export default router;

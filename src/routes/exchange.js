import express from 'express';
import exchangeController from '../controllers/exchange.js';

const router = express.Router();

router
	.get('/', exchangeController.getAllExchanges)
	.get('/:id', exchangeController.getExchangeById)
	.post('/', exchangeController.createExchange)
	.put('/:id', exchangeController.updateExchange)
	.delete('/:id', exchangeController.deleteExchange);

export default router;

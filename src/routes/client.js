import express from 'express';
import clientController from '../controllers/client.js';

const router = express.Router();

router
	.get('/', clientController.getAllClients)
	.get('/filtered', clientController.getFilteredClients)
	.get('/:id', clientController.getClientById)
	.post('/', clientController.createClient)
	.put('/:id', clientController.updateClient)
	.delete('/all', clientController.deleteAll)
	.delete('/:id', clientController.deleteClient);

export default router;

import express from 'express';
import workStationController from '../controllers/workStation.js';

const router = express.Router();

router
	.get('/', workStationController.getAllWorkStations)
	.get('/lite', workStationController.getAllWithoutPopulate)
	.get('/:id', workStationController.getWorkStationById)
	.get(
		'/lite/:id',
		workStationController.getByIdWithoutPopulate
	)
	.post('/', workStationController.createWorkStation)
	.put('/:id', workStationController.updateWorkStation)
	.delete('/:id', workStationController.deleteWorkStation);

export default router;

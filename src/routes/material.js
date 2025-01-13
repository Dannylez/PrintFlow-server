import express from 'express';
import materialController from '../controllers/material.js';

const router = express.Router();

router
	.get('/', materialController.getAllMaterials)
	.get('/filtered', materialController.getFilteredMaterials)
	.get('/:id', materialController.getMaterialById)
	.post('/', materialController.createMaterial)
	.put('/:id', materialController.updateMaterial)
	.delete('/all', materialController.deleteAll)
	.delete('/:id', materialController.deleteMaterial);

export default router;

import express from 'express';
import materialController from '../controllers/material.js';

const router = express.Router();

router
	.get('/', materialController.getAllMaterials)
	.get('/:id', materialController.getMaterialById)
	.post('/', materialController.createMaterial)
	.delete('/all', materialController.deleteAll)
	.delete('/:id', materialController.deleteMaterial);

export default router;

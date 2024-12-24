import mongoose from 'mongoose';
import Operation from '../models/operation.js';

const getAllOperations = async (req, res) => {
	try {
		const operations = await Operation.find().populate(
			'workStation'
		);

		return res.status(200).json({
			operations,
		});
	} catch (error) {
		return res.status(500).json({
			message:
				'Error al obtener las operaciones de trabajo',
			error,
		});
	}
};

const getOperationById = async (req, res) => {
	const { id } = req.params;

	try {
		const operation = await Operation.findById(id).populate(
			'workStation'
		);

		if (!operation) {
			return res.status(404).json({
				message:
					'La operacion que estás buscando no existe',
			});
		}

		return res.status(200).json({
			operation,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la información',
			error,
		});
	}
};

const createOperation = async (req, res) => {
	const { name } = req.body;

	try {
		const alreadyExists = await Operation.findOne({
			name,
		});
		if (alreadyExists) {
			return res.status(400).json({
				message: `Ya existe una operación con el nombre ${req.body.name}`,
			});
		}

		const operationCreated = await Operation.create(
			req.body
		);
		return res.status(200).json({
			message: 'Operación creada correctamente!',
			operationCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear operación de trabajo',
			error,
		});
	}
};

const updateOperation = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		const oldOperation = await Operation.findById(id);
		if (!oldOperation) {
			return res.status(404).json({
				message:
					'La operación que estás buscando no existe',
			});
		}

		const alreadyExists = await Operation.findOne({
			name,
		});
		if (
			alreadyExists &&
			!alreadyExists._id.equals(
				mongoose.Types.ObjectId.isValid(id)
			)
		) {
			return res.status(400).json({
				message: `Ya existe una operación con el nombre ${name}`,
			});
		}

		const updatedOperation =
			await Operation.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'Operación de trabajo actualizada!',
			oldOperation,
			updatedOperation,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar información',
			error,
		});
	}
};

const deleteOperation = async (req, res) => {
	const { id } = req.params;

	try {
		const operationToDelete =
			await Operation.findByIdAndDelete(id);
		if (!operationToDelete) {
			return res.status(404).json({
				message:
					'La operación de trabajo que estás buscando no existe',
			});
		}

		return res.status(200).json({
			message: 'Operación de trabajo eliminada!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar operación de trabajo',
			error,
		});
	}
};

export default {
	getAllOperations,
	getOperationById,
	createOperation,
	updateOperation,
	deleteOperation,
};
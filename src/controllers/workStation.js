import mongoose from 'mongoose';
import WorkStation from '../models/workStation.js';

const getAllWorkStations = async (req, res) => {
	try {
		const stations = await WorkStation.find()
			.populate('tasks')
			.populate('responsible');

		return res.status(200).json({
			stations,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las estaciones de trabajo',
			error,
		});
	}
};

const getWorkStationById = async (req, res) => {
	const { id } = req.params;

	try {
		const station = await WorkStation.findById(id)
			.populate('tasks')
			.populate('responsible');

		if (!station) {
			return res.status(404).json({
				message:
					'La estación de trabajo que estás buscando no existe',
			});
		}

		return res.status(200).json({
			station,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la información',
			error,
		});
	}
};

const createWorkStation = async (req, res) => {
	const { name } = req.body;

	try {
		const alreadyExists = await WorkStation.findOne({
			name,
		});
		if (alreadyExists) {
			return res.status(400).json({
				message: `Ya existe una estación con el nombre ${req.body.name}`,
			});
		}

		const stationCreated = await WorkStation.create(
			req.body
		);
		return res.status(200).json({
			message: 'Estación de trabajo creada correctamente!',
			stationCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear estación de trabajo',
			error,
		});
	}
};

const updateWorkStation = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	const { tasks } = req.body;

	try {
		const oldStation = await WorkStation.findById(id);
		if (!oldStation) {
			return res.status(404).json({
				message:
					'La estación de trabajo que estás buscando no existe',
			});
		}

		if (tasks && tasks.length === oldStation.tasks.length) {
			const sameTasks = tasks.every(
				(value, index) =>
					value === oldStation.tasks[index].toString()
			);
			if (
				sameTasks ||
				(tasks.length === 0 &&
					oldStation.tasks.length === 0)
			) {
				return res.status(400).json({
					message:
						'No se puede actualizar. El campo de tareas es idéntico al valor anterior.',
				});
			}
		}

		const alreadyExists = await WorkStation.findOne({
			name,
		});
		if (
			alreadyExists &&
			!alreadyExists._id.equals(
				mongoose.Types.ObjectId.isValid(id)
			)
		) {
			return res.status(400).json({
				message: `Ya existe una estación con el nombre ${req.body.name}`,
			});
		}

		const updatedStation =
			await WorkStation.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'Estación de trabajo actualizada!',
			oldStation,
			updatedStation,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar información',
			error,
		});
	}
};

const deleteWorkStation = async (req, res) => {
	const { id } = req.params;

	try {
		const stationToDelete =
			await WorkStation.findByIdAndDelete(id);
		if (!stationToDelete) {
			return res.status(404).json({
				message:
					'La estación de trabajo que estás buscando no existe',
			});
		}

		return res.status(200).json({
			message: 'Estación de trabajo eliminada!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar estación de trabajo',
			error,
		});
	}
};

export default {
	getAllWorkStations,
	getWorkStationById,
	createWorkStation,
	updateWorkStation,
	deleteWorkStation,
};

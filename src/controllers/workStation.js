import mongoose from 'mongoose';
import WorkStation from '../models/workStation.js';

const getAllWorkStations = async (req, res) => {
	try {
		const stations = await WorkStation.find()
			.populate('tasks')
			.populate('responsible');

		return res.status(200).json({
			data: stations,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las estaciones de trabajo',
			data: undefined,
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
				data: undefined,
			});
		}

		return res.status(200).json({
			data: station,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la información',
			data: undefined,
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
				message: 'Esa estación de trabajo ya existe',
				data: req.body.name,
			});
		}

		const stationCreated = await WorkStation.create(
			req.body
		);
		return res.status(200).json({
			message: 'Estación de trabajo creada correctamente!',
			data: stationCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear estación de trabajo',
			data: undefined,
			error,
		});
	}
};

const updateWorkStation = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		const stationToUpdate = await WorkStation.findById(id);
		if (!stationToUpdate) {
			return res.status(404).json({
				message:
					'La estación de trabajo que estás buscando no existe',
				data: undefined,
			});
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
				message: 'Esa estación de trabajo ya existe',
				data: req.body.name,
			});
		}

		const stationUpdated =
			await WorkStation.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'Estación de trabajo actualizada!',
			data: stationUpdated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar información',
			data: undefined,
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
				data: undefined,
			});
		}

		return res.status(200).json({
			message: 'Estación de trabajo eliminada!',
			data: undefined,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar estación de trabajo',
			data: undefined,
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

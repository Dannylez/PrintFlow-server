import mongoose from 'mongoose';
import Exchange from '../models/exchange.js';

const getAllExchanges = async (req, res) => {
	try {
		const exchanges = await Exchange.find();

		return res.status(200).json({
			exchanges,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error',
			error,
		});
	}
};

const getExchangeById = async (req, res) => {
	const { id } = req.params;

	try {
		const exchange = await Exchange.findById(id);

		if (!exchange) {
			return res.status(404).json({
				message:
					'El exchangee que estás buscando no existe',
			});
		}

		return res.status(200).json({
			exchange,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener al exchangee',
			error,
		});
	}
};

const createExchange = async (req, res) => {
	try {
		const newExchange = await Exchange.create(req.body);
		return res.status(200).json({
			message: 'Exchangee creado correctamente!',
			newExchange,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear exchangee',
			error,
		});
	}
};

const updateExchange = async (req, res) => {
	const { id } = req.params;

	try {
		const exchangeToUpdate = await Exchange.findById(id);
		if (!exchangeToUpdate) {
			return res.status(404).json({
				message: 'El exchange que estás buscando no existe',
			});
		}
		const updatedExchange =
			await Exchange.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'Exchange actualizado!',
			updatedExchange,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al actualizar exchangee',
			error,
		});
	}
};

const deleteExchange = async (req, res) => {
	const { id } = req.params;

	try {
		const exchangeToDelete =
			await Exchange.findByIdAndDelete(id);
		if (!exchangeToDelete) {
			return res.status(404).json({
				message: 'El exchange que estás buscando no existe',
			});
		}

		return res.status(200).json({
			message: 'Exchange eliminado!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar exchangee',
			error,
		});
	}
};

export default {
	getAllExchanges,
	getExchangeById,
	createExchange,
	updateExchange,
	deleteExchange,
};

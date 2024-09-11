import mongoose from 'mongoose';
import Client from '../models/client.js';

const getAllClients = async (req, res) => {
	try {
		const clients = await Client.find().populate('orders');

		return res.status(200).json({
			data: clients,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al obtener los clientes',
			data: undefined,
			error,
		});
	}
};

const getClientById = async (req, res) => {
	const { id } = req.params;

	try {
		const client = await Client.findById(id).populate(
			'orders'
		);

		if (!client) {
			return res.status(404).json({
				message: 'El cliente que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			data: client,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener al cliente',
			data: undefined,
			error,
		});
	}
};

const getClientIdsByName = async (clientName) => {
	const clients = await Client.find({
		companyName: {
			$regex: clientName,
			$options: 'i',
		},
	});
	return clients.map((client) => client._id);
};

const createClient = async (req, res) => {
	const { companyName } = req.body;

	try {
		const alreadyExists = await Client.findOne({
			companyName,
		});
		if (alreadyExists) {
			return res.status(400).json({
				message: 'Ese nombre de cliente ya está ocupado',
				data: req.body.companyName,
			});
		}

		const clientCreated = await Client.create(req.body);
		return res.status(200).json({
			message: 'Cliente creado correctamente!',
			data: clientCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear cliente',
			data: undefined,
			error,
		});
	}
};

const updateClient = async (req, res) => {
	const { id } = req.params;
	const { companyName } = req.body;

	try {
		const clientToUpdate = await Client.findById(id);
		if (!clientToUpdate) {
			return res.status(404).json({
				message: 'El cliente que estás buscando no existe',
				data: undefined,
			});
		}

		const alreadyExists = await Client.findOne({
			companyName,
		});
		if (
			alreadyExists &&
			!alreadyExists._id.equals(
				mongoose.Types.ObjectId.isValid(id)
			)
		) {
			return res.status(400).json({
				message: 'Ese nombre de cliente ya está ocupado',
				data: req.body.companyName,
			});
		}

		const clientUpdated = await Client.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		return res.status(200).json({
			message: 'Cliente actualizado!',
			data: clientUpdated,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al actualizar cliente',
			data: undefined,
			error,
		});
	}
};

const deleteClient = async (req, res) => {
	const { id } = req.params;

	try {
		const clientToDelete = await Client.findByIdAndDelete(
			id
		);
		if (!clientToDelete) {
			return res.status(404).json({
				message: 'El cliente que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			message: 'Cliente eliminado!',
			data: undefined,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar cliente',
			data: undefined,
			error,
		});
	}
};

export default {
	getAllClients,
	getClientById,
	getClientIdsByName,
	createClient,
	updateClient,
	deleteClient,
};

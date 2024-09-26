import mongoose from 'mongoose';
import Client from '../models/client.js';

const getAllClients = async (req, res) => {
	try {
		const clients = await Client.find().populate('orders');

		return res.status(200).json({
			clients,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al obtener los clientes',
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
			});
		}

		return res.status(200).json({
			client,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener al cliente',
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
				message: `El nombre de cliente ${req.body.companyName} ya está ocupado`,
			});
		}

		const newClient = await Client.create(req.body);
		return res.status(200).json({
			message: 'Cliente creado correctamente!',
			newClient,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear cliente',
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
			});
		}

		const alreadyExists = await Client.findOne({
			companyName,
		});
		if (
			alreadyExists &&
			!alreadyExists._id.equals(clientToUpdate._id)
		) {
			return res.status(400).json({
				message: `El nombre de cliente ${req.body.companyName} ya está ocupado`,
			});
		}
		const updatedClient = await Client.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		return res.status(200).json({
			message: 'Cliente actualizado!',
			updatedClient,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al actualizar cliente',
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
			});
		}

		return res.status(200).json({
			message: 'Cliente eliminado!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar cliente',
			error,
		});
	}
};

const deleteAll = async (req, res) => {
	try {
		const result = await Client.deleteMany({});
		return res.status(200).json({
			message: `Se borraron ${result.deletedCount} clientes`,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar clientes',
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
	deleteAll,
};

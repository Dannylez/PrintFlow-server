import mongoose from 'mongoose';
import User from '../models/user.js';

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
			.populate({
				path: 'comments',
				populate: [{ path: 'task' }, { path: 'order' }],
			})
			.populate('workStation');

		return res.status(200).json({
			data: users,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener los usuarios',
			data: undefined,
			error,
		});
	}
};

const getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id)
			.populate({
				path: 'comments',
				populate: [{ path: 'task' }, { path: 'order' }],
			})
			.populate('workStation');

		if (!user) {
			return res.status(404).json({
				message: 'El usuario que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener al usuario',
			data: undefined,
			error,
		});
	}
};

const createUser = async (req, res) => {
	const { username } = req.body;

	try {
		const alreadyExists = await User.findOne({ username });
		if (alreadyExists) {
			return res.status(400).json({
				message: 'Ese nombre de usuario ya está ocupado',
				data: req.body.username,
			});
		}

		const userCreated = await User.create(req.body);
		return res.status(200).json({
			message: 'Usuario creado correctamente!',
			data: userCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear usuario',
			data: undefined,
			error,
		});
	}
};

const updateUser = async (req, res) => {
	const { id } = req.params;
	const { username } = req.body;

	try {
		const userToUpdate = await User.findById(id);
		if (!userToUpdate) {
			return res.status(404).json({
				message: 'El usuario que estás buscando no existe',
				data: undefined,
			});
		}

		const alreadyExists = await User.findOne({ username });
		if (
			alreadyExists &&
			!alreadyExists._id.equals(
				mongoose.Types.ObjectId.isValid(id)
			)
		) {
			return res.status(400).json({
				message: 'Ese nombre de usuario ya está ocupado',
				data: req.body.username,
			});
		}

		const userUpdated = await User.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		return res.status(200).json({
			message: 'Usuario actualizado!',
			data: userUpdated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar usuario',
			data: undefined,
			error,
		});
	}
};

const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const userToDelete = await User.findByIdAndDelete(id);
		if (!userToDelete) {
			return res.status(404).json({
				message: 'El usuario que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			message: 'Usuario eliminado!',
			data: undefined,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar usuario',
			data: undefined,
			error,
		});
	}
};

export default {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
};

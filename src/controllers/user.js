import mongoose from 'mongoose';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
			.populate({
				path: 'comments',
				populate: [{ path: 'task' }, { path: 'order' }],
			})
			.populate('workStation');

		return res.status(200).json({
			users,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener los usuarios',
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
			});
		}

		return res.status(200).json({
			user,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener al usuario',
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
				message: `El nombre de usuario ${req.body.username} ya está ocupado`,
			});
		}

		const newUser = await User.create(req.body);
		return res.status(200).json({
			message: 'Usuario creado correctamente!',
			newUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear usuario',
			error,
		});
	}
};

const login = async (req, res) => {
	const jwtSecret = process.env.JWT_SECRET;
	const { username, pw } = req.body;

	if (!username || !pw) {
		return res.status(400).json({
			error:
				'Se deben proporcionar tanto el nombre de usuario como la contraseña',
		});
	}

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({
				error: 'Usuario no encontrado',
			});
		}
		if (user.pw === pw) {
			const token = jwt.sign(
				{
					userId: user._id,
					username,
				},
				jwtSecret,
				{ expiresIn: '30d' }
			);
			return res.status(200).json({
				message: 'Sesión iniciada',
				token,
			});
		}

		return res.status(400).json({
			error: 'Contraseña incorrecta',
		});
	} catch (error) {
		return res.status(500).json({
			error: 'Error del servidor, intente de nuevo',
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
				message: `El nombre de usuario ${req.body.username} ya está ocupado`,
			});
		}

		const userUpdated = await User.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		return res.status(200).json({
			message: 'Usuario actualizado!',
			userUpdated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar usuario',
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
			});
		}

		return res.status(200).json({
			message: 'Usuario eliminado!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar usuario',
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
	login,
};

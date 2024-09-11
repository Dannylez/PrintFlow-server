import Task from '../models/task.js';

const getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find()
			.populate('order')
			.populate({
				path: 'comments',
				populate: [{ path: 'user' }],
			})
			.populate('stations');

		return res.status(200).json({
			data: tasks,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al obtener las tareas',
			data: undefined,
			error,
		});
	}
};

const getTaskById = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findById(id)
			.populate('order')
			.populate({
				path: 'comments',
				populate: [{ path: 'user' }],
			})
			.populate('stations');

		if (!task) {
			return res.status(404).json({
				message: 'La tarea que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			data: task,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la Tarea',
			data: undefined,
			error,
		});
	}
};

const createTask = async (req, res) => {
	try {
		const taskCreated = await Task.create(req.body);
		return res.status(200).json({
			message: 'Tarea creada correctamente!',
			data: taskCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear la tarea',
			data: undefined,
			error,
		});
	}
};

const updateTask = async (req, res) => {
	const { id } = req.params;
	try {
		const taskToUpdate = await Task.findById(id);
		if (!taskToUpdate) {
			return res.status(404).json({
				message: 'La tarea que estás buscando no existe',
				data: undefined,
			});
		}

		const taskUpdated = await Task.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		return res.status(200).json({
			message: 'Tarea actualizada!',
			data: taskUpdated,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al actualizar la tarea',
			data: undefined,
			error,
		});
	}
};

const deleteTask = async (req, res) => {
	const { id } = req.params;

	try {
		const taskToDelete = await Task.findByIdAndDelete(id);
		if (!taskToDelete) {
			return res.status(404).json({
				message: 'La tarea que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			message: 'Tarea eliminada!',
			data: undefined,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar la tarea',
			data: undefined,
			error,
		});
	}
};

export default {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};

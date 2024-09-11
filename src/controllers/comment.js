import Comment from '../models/comment.js';

const getAllComments = async (req, res) => {
	try {
		const comments = await Comment.find()
			.populate('user')
			.populate('task')
			.populate('order');

		return res.status(200).json({
			data: comments,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener los comentarios',
			data: undefined,
			error,
		});
	}
};

const getCommentById = async (req, res) => {
	const { id } = req.params;

	try {
		const comment = await Comment.findById(id)
			.populate('user')
			.populate('task')
			.populate('order');

		if (!comment) {
			return res.status(404).json({
				message:
					'El comentario que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			data: comment,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener el comentario',
			data: undefined,
			error,
		});
	}
};

const createComment = async (req, res) => {
	try {
		const commentCreated = await Comment.create(req.body);
		return res.status(200).json({
			message: 'Comentario creado correctamente!',
			data: commentCreated,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear comentario',
			data: undefined,
			error,
		});
	}
};

const deleteComment = async (req, res) => {
	const { id } = req.params;

	try {
		const commentToDelete = await Comment.findByIdAndDelete(
			id
		);
		if (!commentToDelete) {
			return res.status(404).json({
				message:
					'El comentario que estás buscando no existe',
				data: undefined,
			});
		}

		return res.status(200).json({
			message: 'Comentario eliminado!',
			data: undefined,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar comentario',
			data: undefined,
			error,
		});
	}
};

export default {
	getAllComments,
	getCommentById,
	createComment,
	deleteComment,
};

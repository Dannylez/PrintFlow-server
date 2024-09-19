import Comment from '../models/comment.js';

const getAllComments = async (req, res) => {
	try {
		const comments = await Comment.find()
			.populate('user')
			.populate('task')
			.populate('order');

		return res.status(200).json({
			comments,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener los comentarios',
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
			});
		}

		return res.status(200).json({
			comment,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener el comentario',
			error,
		});
	}
};

const createComment = async (req, res) => {
	try {
		const newComment = await Comment.create(req.body);
		return res.status(200).json({
			message: 'Comentario creado correctamente!',
			newComment,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear comentario',
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
			});
		}

		return res.status(200).json({
			message: 'Comentario eliminado!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar comentario',
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

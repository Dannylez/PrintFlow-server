import express from 'express';
import commentController from '../controllers/comment.js';

const router = express.Router();

router
	.get('/', commentController.getAllComments)
	.get('/:id', commentController.getCommentById)
	.post('/', commentController.createComment)
	.delete('/:id', commentController.deleteComment);

export default router;

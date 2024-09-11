import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
	},
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Comment', commentSchema);

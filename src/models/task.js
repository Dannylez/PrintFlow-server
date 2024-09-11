import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	processes: {
		type: String,
		required: true,
	},
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
	},
	stations: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'WorkStation',
	},
	comments: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Comment',
	},
	finished: {
		type: Boolean,
		required: true,
	},
});

export default mongoose.model('Task', taskSchema);

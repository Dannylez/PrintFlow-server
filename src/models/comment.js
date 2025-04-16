import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
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

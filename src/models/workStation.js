import mongoose from 'mongoose';

const { Schema } = mongoose;

const workStationSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	tasks: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Task',
	},
	operations: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Operation',
	},
	isPrintable: {
		type: Boolean,
	},
	responsible: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
	order: { type: Number, required: true },
});

export default mongoose.model(
	'WorkStation',
	workStationSchema
);

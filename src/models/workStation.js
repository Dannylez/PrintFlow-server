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
	responsible: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
});

export default mongoose.model(
	'WorkStation',
	workStationSchema
);

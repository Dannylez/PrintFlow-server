import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	orderNumber: {
		type: Number,
		required: true,
	},
	product: {
		type: String,
		required: true,
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client',
		required: true,
	},
	contact: {
		type: String,
		required: true,
	},
	deliveryData: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: [
			'Cancelado',
			'En espera',
			'En proceso',
			'Completado',
		],
	},
	request: {
		type: String,
		required: true,
	},
	scheme: {
		type: [String],
	},
	dateReceived: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: String,
		required: true,
	},
	dateEstimate: {
		type: String,
		required: true,
	},
	dateFinal: {
		type: String,
		required: true,
	},
	descriptionClient: {
		type: String,
		required: true,
	},
	descriptionWork: {
		type: String,
		required: true,
	},
	tasks: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Task',
	},
	budgetEstimate: {
		type: Number,
		required: true,
	},
	budget: {
		type: Number,
		required: true,
	},
	comments: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Comment',
	},
	deviation: {
		type: String,
	},
});

export default mongoose.model('Order', orderSchema);

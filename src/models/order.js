import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema({
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
		type: [
			{
				name: {
					type: String,
					required: true,
				},
				phone: {
					type: String,
				},
				email: {
					type: String,
				},
			},
		],
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
	/* 	request: {
		type: String,
		required: true,
	}, */
	scheme: {
		link: { type: String },
		files: {
			type: [
				{
					name: { type: String },
					size: { type: Number },
					type: { type: String },
				},
			],
		},
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
	},
	descriptionClient: {
		type: String,
	},
	descriptionWork: {
		type: String,
	},
	descriptionPrivate: {
		type: String,
	},
	tasks: [{ type: Object }],
	stationsList: [
		{
			station: {
				type: String,
			},
			completed: { type: Boolean, default: false },
			number: { type: Number },
		},
	],
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
	fields: {
		type: Object,
	},
});

export default mongoose.model('Order', orderSchema);

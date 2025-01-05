import mongoose from 'mongoose';

const { Schema } = mongoose;

const operationSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	unitType: {
		type: String,
		enum: [
			'Horas',
			'Clicks',
			'Metro cuadrado',
			'Tiraje',
			'Unitario',
		],
	},
	unitCost: { type: Number },
	plateCost: { type: Number },
	pricingRules: [
		{
			range: { type: Number },
			rangeStart: { type: Number },
			rangeEnd: { type: Number },
			price: { type: Number },
			step: { type: Number },
		},
	],
	minPrice: { type: Number },
	workStation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'WorkStation',
		required: true,
	},
	isAllTask: { type: Boolean, required: true },
	isPrintable: { type: Boolean, required: true },
});

export default mongoose.model('Operation', operationSchema);

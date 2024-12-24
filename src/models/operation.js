import mongoose from 'mongoose';

const { Schema } = mongoose;

const operationSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	plateCost: { type: Number },
	costPerHour: { type: Number },
	costPerClick: { type: Number },
	costPerSquareMeter: { type: Number },
	costPerPrint: { type: Number },
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
	allTask: { type: Boolean },
});

export default mongoose.model('Operation', operationSchema);
import mongoose from 'mongoose';

const { Schema } = mongoose;

const materialSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
	},
	sizes: {
		type: [String],
	},
	grammage: {
		type: [String],
	},
	pricePerTon: {
		type: String,
	},
	pricePerUnit: {
		type: String,
	},
	pricePerSquareMeter: {
		type: String,
	},
});

export default mongoose.model('Material', materialSchema);

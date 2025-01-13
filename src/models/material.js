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
	unitType: {
		type: String,
		enum: ['Tonelada', 'Unidad', 'Metro cuadrado'],
	},
	pricePerUnitType: {
		type: String,
	},
});

export default mongoose.model('Material', materialSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const exchangeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	conversion: {
		type: Number,
		required: true,
	},
	symbol: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Exchange', exchangeSchema);

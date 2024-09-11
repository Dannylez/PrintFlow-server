import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	tasks: {
		type: [String],
		required: true,
	},
});

export default mongoose.model('Product', productSchema);

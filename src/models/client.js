import mongoose from 'mongoose';

const { Schema } = mongoose;

const clientSchema = new Schema({
	companyName: {
		type: String,
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
		type: [String],
	},
	orders: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Order',
	},
});

export default mongoose.model('Client', clientSchema);

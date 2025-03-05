import mongoose from 'mongoose';

const { Schema } = mongoose;

const clientSchema = new Schema({
	companyName: {
		type: String,
		required: true,
	},
	legalName: {
		type: String,
	},
	RUT: {
		type: String,
	},
	contact: {
		type: [
			{
				name: {
					type: String,
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
	address: {
		type: String,
	},
	phone: {
		type: String,
	},
	extraInfo: {
		type: String,
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

import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderFieldsSchema = new Schema({
	values: {
		type: Object,
	},
});

export default mongoose.model(
	'OrderFields',
	orderFieldsSchema
);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		enum: ['ADMIN', 'WORKER', 'SUPERADMIN'],
	},
	username: {
		type: String,
		required: true,
	},
	pw: {
		type: String,
		minLength: 4,
		required: true,
	},
	comments: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Comment',
	},
	workStation: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'WorkStation',
	},
});

export default mongoose.model('User', userSchema);

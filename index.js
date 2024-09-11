import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

dotenv.config();

const { PORT, DB_URL } = process.env;

mongoose
	.connect(DB_URL)
	.then(() => console.log('CONNECTED DB'))
	.then(() =>
		app.listen(PORT, () => {
			console.log(
				`El servidor está escuchando en el puerto ${PORT}`
			);
		})
	)
	.catch((error) => console.log('Error: ', error));

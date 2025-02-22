import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Client from '../../src/models/client.js';
import User from '../../src/models/user.js';
import WorkStation from '../../src/models/workStation.js';
import Task from '../../src/models/task.js';
import Order from '../../src/models/order.js';
import Comment from '../../src/models/comment.js';

let mongoServer;

export const setupDatabase = async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri(), {});

	// Cargar datos de prueba
	await loadTestData();
};

export const loadTestData = async () => {
	await Client.create([
		{
			_id: '66e036a5245a998bb5d00c95',
			companyName: 'Arcos dorados',
			contact: [
				{
					name: 'Mariana',
					phone: '099192932',
					email: 'hola@hotmail.com',
					_id: '66e036a5245a998bb5d00c96',
				},
			],
			deliveryData: ['Entregar en la puerta'],
			orders: [],
		},
		{
			_id: '66e036a5245a998bb5d00c94',
			companyName: 'Koro',
			contact: [
				{
					name: 'Shirley',
					phone: '099195432',
					email: 'chau@hotmail.com',
					_id: '66e036a5245a998bb5d00c89',
				},
			],
			deliveryData: ['Entregar en la puerta de atras'],
			orders: [],
		},
	]);
	await User.create([
		{
			_id: '60b8a7f9e1d1c821c8a48159',
			name: 'Daniel',
			role: 'ADMIN',
			username: 'Danylez',
			pw: '1234',
			comments: ['60b8a7f9e1d1c821c8a48162'],
			workStation: ['60b8a7f9e1d1c821c8a48161'],
		},
		{
			_id: '60b8a7f9e1d1c821c8a4815a',
			name: 'Diego',
			role: 'WORKER',
			username: 'Diegolez',
			pw: '1234',
			comments: ['60b8a7f9e1d1c821c8a48160'],
			workStation: ['60b8a7f9e1d1c821c8a4815f'],
		},
	]);
	await WorkStation.create([
		{
			_id: '60b8a7f9e1d1c821c8a48161',
			name: 'Komori',
			tasks: ['60b8a7f9e1d1c821c8a4815b'],
			responsible: ['60b8a7f9e1d1c821c8a48159'],
		},
		{
			_id: '60b8a7f9e1d1c821c8a4815f',
			name: 'Diseño',
			tasks: ['60b8a7f9e1d1c821c8a4815c'],
			responsible: ['60b8a7f9e1d1c821c8a4815a'],
		},
	]);
	await Task.create([
		{
			_id: '60b8a7f9e1d1c821c8a4815b',
			name: 'Tapa libro',
			description: 'Tapa amarilla',
			processes: 'proceso',
			order: '60b8a7f9e1d1c821c8a4815d',
			stations: [
				'60b8a7f9e1d1c821c8a48161',
				'60b8a7f9e1d1c821c8a4815f',
			],
			comments: [],
			finished: false,
		},
		{
			_id: '60b8a7f9e1d1c821c8a4815c',
			name: 'Bloc libro',
			description: 'Bloc blanco',
			processes: 'proceso',
			order: '60b8a7f9e1d1c821c8a4815e',
			stations: [
				'60b8a7f9e1d1c821c8a48161',
				'60b8a7f9e1d1c821c8a4815f',
			],
			comments: ['60b8a7f9e1d1c821c8a48160'],
			finished: false,
		},
	]);
	await Order.create([
		{
			_id: '60b8a7f9e1d1c821c8a4815d',
			name: 'Libro',
			orderNumber: 1,
			product: 'Libro',
			client: '66e036a5245a998bb5d00c95',
			contact: 'paosd',
			deliveryData: 'fasdas',
			status: 'Aceptada',
			request: 'Porfavor haceme un libro',
			dateReceived: '09/09/24',
			dateCreated: '09/09/24',
			dateEstimate: '15/09/24',
			dateFinal: '18/09/24',
			descriptionClient: 'Te hacemos un libro',
			descriptionWork: 'Hay que hacer un libro',
			tasks: ['60b8a7f9e1d1c821c8a4815b'],
			budgetEstimate: 400,
			budget: 500,
			comments: ['60b8a7f9e1d1c821c8a48162'],
			deviation: '',
		},
		{
			_id: '60b8a7f9e1d1c821c8a4815e',
			name: 'Libro Bloc',
			orderNumber: 2,
			product: 'Libro',
			client: '66e036a5245a998bb5d00c94',
			contact: 'paosd',
			deliveryData: 'fasdas',
			status: 'Abierta',
			request: 'Porfavor haceme un libro',
			dateReceived: '09/09/24',
			dateCreated: '09/09/24',
			dateEstimate: '15/09/24',
			dateFinal: '18/09/24',
			descriptionClient: 'Te hacemos un libro',
			descriptionWork: 'Hay que hacer un libro',
			tasks: ['60b8a7f9e1d1c821c8a4815c'],
			budgetEstimate: 400,
			budget: 500,
			comments: [],
			deviation: '',
		},
	]);
	await Comment.create([
		{
			_id: '60b8a7f9e1d1c821c8a48162',
			user: '60b8a7f9e1d1c821c8a48159',
			order: '60b8a7f9e1d1c821c8a4815d',
			content: 'Hola',
			date: '09/09/24',
		},
		{
			_id: '60b8a7f9e1d1c821c8a48160',
			user: '60b8a7f9e1d1c821c8a4815a',
			task: '60b8a7f9e1d1c821c8a4815c',
			content: 'Hola',
			date: '09/09/24',
		},
	]);
};

export const tearDownDatabase = async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
};

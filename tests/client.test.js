import request from 'supertest';
import app from '../src/app';

const url = '/api/client/';
const clientId = '66e036a5245a998bb5d00c95';
const falseId = '67e036a5245a998bb5d00c95';
const newClient = {
	_id: '66e036a5245a998bb5d00c91',
	companyName: 'Mc donalds',
	contact: [
		{
			name: 'Pepe',
			phone: '099192232',
			email: 'jaja@hotmail.com',
			_id: '66e036a5245a998bb5d00c95',
		},
	],
	deliveryData: ['8 de octubre y propios'],
	orders: [],
};
const repeatedClient = {
	companyName: 'Koro',
};
const editedClient = {
	companyName: 'Mc donaldss',
	contact: [
		{
			name: 'Pepe',
			phone: '099192232',
			email: 'jaja@hotmail.com',
			_id: '66e036a5245a998bb5d00c95',
		},
	],
	deliveryData: ['8 de octubre y propios'],
	orders: [],
};

describe('client REST', () => {
	it('Debe traer lista de clientes', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.data).toHaveLength(2);
	});
	it('Debe traer un cliente por su id', async () => {
		const response = await request(app).get(
			`${url}${clientId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear un cliente nuevo', async () => {
		const created = await request(app)
			.post(`${url}`)
			.send(newClient);

		expect(created.statusCode).toBe(200);
		expect(created.body.data).toMatchObject(newClient);

		const repeated = await request(app)
			.post(`${url}`)
			.send(newClient);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe editar un cliente', async () => {
		const wrongId = await request(app)
			.put(`${url}${falseId}`)
			.send(editedClient);

		expect(wrongId.statusCode).toBe(404);

		const edited = await request(app)
			.put(`${url}${clientId}`)
			.send(editedClient);

		expect(edited.statusCode).toBe(200);
		expect(edited.body.data).toMatchObject(editedClient);

		const repeated = await request(app)
			.put(`${url}${clientId}`)
			.send(repeatedClient);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe eliminar un cliente', async () => {
		const deleted = await request(app).delete(
			`${url}${clientId}`
		);
		expect(deleted.statusCode).toBe(200);

		const doesntExist = await request(app).get(
			`${url}${clientId}`
		);

		expect(doesntExist.statusCode).toBe(404);

		const wrongId = await request(app).delete(
			`${url}${falseId}`
		);
		expect(wrongId.statusCode).toBe(404);
	});
});

import request from 'supertest';
import app from '../src/app';

const url = '/api/order/';
const orderId = '60b8a7f9e1d1c821c8a4815d';
const wrongId = '60b8a7f9e1d1c821c8a4815a';
const newOrder = {
	_id: '60b8a7f9e1d2c821c8a4815d',
	name: 'Libro',
	orderNumber: 3,
	product: 'Libro',
	client: '66e036a5245a998bb5d00c95',
	contact: 'paosd',
	deliveryData: 'fasdas',
	status: 'En proceso',
	request: 'Porfavor haceme un libro',
	dateReceived: '09/09/24',
	dateCreated: '09/09/24',
	dateEstimate: '15/09/24',
	dateFinal: '18/09/24',
	descriptionClient: 'Te hacemos un libro',
	descriptionWork: 'Hay que hacer un libro',
	tasks: ['60b8a7f9e1d1d821c8a4815b'],
	budgetEstimate: 400,
	budget: 500,
	comments: ['60b8a7f9e1d1c821c8a48162'],
	deviation: '',
};
const repeatedOrder = {
	orderNumber: 2,
};
const editedOrder = {
	product: 'Revista',
};

describe('order REST', () => {
	it('Debe traer lista de todas las ordenes', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.orders).toHaveLength(2);
	});
	it('Debe contar el indice de las ordenes', async () => {
		const response = await request(app).get(`${url}page`);

		expect(response.statusCode).toBe(200);
		expect(response.body.from).toBe(1);
	});
	it('Debe filtrar las ordenes', async () => {
		const filtered1 = await request(app)
			.get(`${url}filtered`)
			.query({ searchTerm: 'Koro' });
		expect(filtered1.statusCode).toBe(200);
		expect(filtered1.body.orders).toHaveLength(1);

		const filtered2 = await request(app)
			.get(`${url}filtered`)
			.query({ searchTerm: 'kor' });
		expect(filtered2.statusCode).toBe(200);
		expect(filtered2.body.orders).toHaveLength(1);

		const filteredWrong = await request(app)
			.get(`${url}filtered`)
			.query({ searchTerm: 'korra' });
		expect(filteredWrong.statusCode).toBe(200);
		expect(filteredWrong.body.orders).toHaveLength(0);

		const filteredByStatus = await request(app)
			.get(`${url}filtered`)
			.query({ status: 'En proceso' });
		expect(filteredByStatus.statusCode).toBe(200);
		expect(filteredByStatus.body.orders).toHaveLength(1);
	});
	it('Debe buscar por numero de orden', async () => {
		const response = await request(app).get(
			`${url}number/1`
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.order.orderNumber).toBe(1);

		const wrongNumber = await request(app).get(
			`${url}number/546`
		);

		expect(wrongNumber.statusCode).toBe(404);
	});
	it('Debe traer una orden por su id', async () => {
		const response = await request(app).get(
			`${url}${orderId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear una orden nueva', async () => {
		const response1 = await request(app)
			.post(`${url}`)
			.send(newOrder);

		expect(response1.statusCode).toBe(200);
		expect(response1.body.newOrder).toMatchObject(newOrder);

		const response2 = await request(app)
			.post(`${url}`)
			.send(repeatedOrder);

		expect(response2.statusCode).toBe(400);
	});
	it('Debe editar una orden', async () => {
		const response1 = await request(app)
			.put(`${url}${wrongId}`)
			.send(editedOrder);

		expect(response1.statusCode).toBe(404);

		const response2 = await request(app)
			.put(`${url}${orderId}`)
			.send(editedOrder);

		expect(response2.statusCode).toBe(200);
	});
	it('Debe eliminar una orden', async () => {
		const response1 = await request(app).delete(
			`${url}${orderId}`
		);
		const response2 = await request(app).get(
			`${url}${orderId}`
		);
		expect(response1.statusCode).toBe(200);
		expect(response2.statusCode).toBe(404);

		const response3 = await request(app).delete(
			`${url}${wrongId}`
		);
		expect(response3.statusCode).toBe(404);
	});
});

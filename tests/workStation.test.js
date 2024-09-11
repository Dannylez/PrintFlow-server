import request from 'supertest';
import app from '../src/app';

const url = '/api/workStation/';
const stationId = '60b8a7f9e1d1c821c8a48161';
const falseId = '67e036a5245a998bb5d00c95';
const newStation = {
	_id: '60b8a7f9e1d1c821c5b48161',
	name: 'Komori2',
	tasks: ['60b8a7f9e1d1c821c8a4815b'],
	responsible: ['60b8a7f9e1d1c821c8a48159'],
};
const repeatedStation = {
	name: 'Komori2',
};
const editedStation = {
	name: 'asdasd',
};

describe('workStation REST', () => {
	it('Debe traer lista de estaciones', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.data).toHaveLength(2);
	});
	it('Debe traer una estacion por su id', async () => {
		const response = await request(app).get(
			`${url}${stationId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear una estacion nueva', async () => {
		const created = await request(app)
			.post(`${url}`)
			.send(newStation);

		expect(created.statusCode).toBe(200);
		expect(created.body.data).toMatchObject(newStation);

		const repeated = await request(app)
			.post(`${url}`)
			.send(newStation);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe editar una estacion', async () => {
		const wrongId = await request(app)
			.put(`${url}${falseId}`)
			.send(editedStation);

		expect(wrongId.statusCode).toBe(404);

		const edited = await request(app)
			.put(`${url}${stationId}`)
			.send(editedStation);

		expect(edited.statusCode).toBe(200);
		expect(edited.body.data).toMatchObject(editedStation);

		const repeated = await request(app)
			.put(`${url}${stationId}`)
			.send(repeatedStation);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe eliminar una estacion', async () => {
		const deleted = await request(app).delete(
			`${url}${stationId}`
		);
		expect(deleted.statusCode).toBe(200);

		const doesntExist = await request(app).get(
			`${url}${stationId}`
		);

		expect(doesntExist.statusCode).toBe(404);

		const wrongId = await request(app).delete(
			`${url}${falseId}`
		);
		expect(wrongId.statusCode).toBe(404);
	});
});

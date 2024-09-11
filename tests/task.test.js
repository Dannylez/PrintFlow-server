import request from 'supertest';
import app from '../src/app';

const url = '/api/task/';
const taskId = '60b8a7f9e1d1c821c8a4815b';
const falseId = '67e036a5245a998bb5d00c95';
const newTask = {
	_id: '60b8a7f9e1d1c821c8a4643b',
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
};
const editedTask = {
	name: 'Tapa libro amarilla',
};

describe('task REST', () => {
	it('Debe traer lista de tareas', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.data).toHaveLength(2);
	});
	it('Debe traer una tarea por su id', async () => {
		const response = await request(app).get(
			`${url}${taskId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear una tarea nuevo', async () => {
		const created = await request(app)
			.post(`${url}`)
			.send(newTask);

		expect(created.statusCode).toBe(200);
		expect(created.body.data).toMatchObject(newTask);
	});
	it('Debe editar una tarea', async () => {
		const wrongId = await request(app)
			.put(`${url}${falseId}`)
			.send(editedTask);

		expect(wrongId.statusCode).toBe(404);

		const edited = await request(app)
			.put(`${url}${taskId}`)
			.send(editedTask);

		expect(edited.statusCode).toBe(200);
		expect(edited.body.data).toMatchObject(editedTask);
	});
	it('Debe eliminar una tarea', async () => {
		const deleted = await request(app).delete(
			`${url}${taskId}`
		);
		expect(deleted.statusCode).toBe(200);

		const doesntExist = await request(app).get(
			`${url}${taskId}`
		);

		expect(doesntExist.statusCode).toBe(404);

		const wrongId = await request(app).delete(
			`${url}${falseId}`
		);
		expect(wrongId.statusCode).toBe(404);
	});
});

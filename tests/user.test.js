import request from 'supertest';
import app from '../src/app';

const url = '/api/user/';
const userId = '60b8a7f9e1d1c821c8a48159';
const falseId = '67e036a5245a998bb5d00c95';
const newUser = {
	_id: '60b8a7f9e1d1c821c8a42159',
	name: 'Daniel',
	role: 'ADMIN',
	username: 'Danylez16',
	pw: '1234',
	comments: ['60b8a7f9e1d1c821c8a48162'],
	workStation: ['60b8a7f9e1d1c821c8a48161'],
};
const repeatedUser = {
	username: 'Diegolez',
};
const editedUser = {
	username: 'asdasd',
};

describe('user REST', () => {
	it('Debe traer lista de usuarios', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.users).toHaveLength(2);
	});
	it('Debe traer un usuario por su id', async () => {
		const response = await request(app).get(
			`${url}${userId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear un usuario nuevo', async () => {
		const created = await request(app)
			.post(`${url}`)
			.send(newUser);

		expect(created.statusCode).toBe(200);
		expect(created.body.newUser).toMatchObject(newUser);

		const repeated = await request(app)
			.post(`${url}`)
			.send(newUser);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe editar un usuario', async () => {
		const wrongId = await request(app)
			.put(`${url}${falseId}`)
			.send(editedUser);

		expect(wrongId.statusCode).toBe(404);

		const edited = await request(app)
			.put(`${url}${userId}`)
			.send(editedUser);

		expect(edited.statusCode).toBe(200);
		expect(edited.body.userUpdated).toMatchObject(
			editedUser
		);

		const repeated = await request(app)
			.put(`${url}${userId}`)
			.send(repeatedUser);

		expect(repeated.statusCode).toBe(400);
	});
	it('Debe eliminar un usuario', async () => {
		const deleted = await request(app).delete(
			`${url}${userId}`
		);
		expect(deleted.statusCode).toBe(200);

		const doesntExist = await request(app).get(
			`${url}${userId}`
		);

		expect(doesntExist.statusCode).toBe(404);

		const wrongId = await request(app).delete(
			`${url}${falseId}`
		);
		expect(wrongId.statusCode).toBe(404);
	});
});

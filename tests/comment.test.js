import request from 'supertest';
import app from '../src/app';

const url = '/api/comment/';
const commentId = '60b8a7f9e1d1c821c8a48162';
const wrongId = '60b8a7f9e1d1c221c8a48162';
const newComment = {
	_id: '66e036a5245a998bb5d14c91',
	user: '60b8a7f9e1d1c821c8a48159',
	order: '60b8a7f9e1d1c821c8a4815d',
	content: 'Hola',
	date: '09/09/24',
};

describe('comment REST', () => {
	it('Debe traer lista de comentarios', async () => {
		const response = await request(app).get(`${url}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.data).toHaveLength(2);
	});
	it('Debe traer un comentario por su id', async () => {
		const response = await request(app).get(
			`${url}${commentId}`
		);
		expect(response.statusCode).toBe(200);
	});
	it('Debe crear un comentario nuevo', async () => {
		const response = await request(app)
			.post(`${url}`)
			.send(newComment);

		expect(response.statusCode).toBe(200);
		expect(response.body.data).toMatchObject(newComment);
	});
	it('Debe eliminar un cliente', async () => {
		const response1 = await request(app).delete(
			`${url}${commentId}`
		);
		const response2 = await request(app).get(
			`${url}${commentId}`
		);
		expect(response1.statusCode).toBe(200);
		expect(response2.statusCode).toBe(404);

		const response3 = await request(app).delete(
			`${url}${wrongId}`
		);
		expect(response3.statusCode).toBe(404);
	});
});

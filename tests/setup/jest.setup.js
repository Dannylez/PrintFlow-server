import {
	setupDatabase,
	tearDownDatabase,
} from './setupDatabase';

beforeAll(async () => {
	await setupDatabase();
});

afterAll(async () => {
	await tearDownDatabase();
});

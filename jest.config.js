export default {
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	coverageDirectory: 'coverage',
	collectCoverage: true,
	setupFilesAfterEnv: ['./tests/setup/jest.setup.js'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	verbose: true,
};

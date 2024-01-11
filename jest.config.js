/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: './src',
	testTimeout: 100000,
	testRegex: '.e2e.test.ts$'
};
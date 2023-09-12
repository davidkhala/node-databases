import assert from 'assert';
import MySQL from '../../mysql/mysql.js';
import {consoleLogger} from '@davidkhala/logger/log4.js';
import {DefaultDatabase} from '../../mysql/index.js';
import dataObjects from './dataObjects.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';

const logger = consoleLogger('mysql:test');
const password = 'password';
export const mysql = new MySQL({password, name: DefaultDatabase.mysql}, logger);

export const containerStart = async () => {
	let stop = () => {
	};
	if (!process.env.CI) {
		stop = await docker(new ContainerManager(undefined, consoleLogger('mysql:docker')), {HostPort: 3306, password});
	}
	return stop;

};

/**
 *
 * @param {MySQL} _mysql
 */
export async function setup(_mysql) {
	const result = {};

	for (const [key, value] of Object.entries(dataObjects)) {
		const model = _mysql.setModel(key, value);
		assert.strictEqual(typeof model, 'function');
		await _mysql.sync(true);
		result[key] = model;
	}
	return result;

};

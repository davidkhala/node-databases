import assert from 'assert';
import MySQL from '../mysql.js';
import {consoleLogger} from '@davidkhala/logger/log4.js';
import {DefaultDatabase} from '@davidkhala/mysql/const.js';
import dataObjects from './dataObjects.js';
import {docker} from '@davidkhala/mysql/test-utils/recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';

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

}

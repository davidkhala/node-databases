import {PGPool} from './index.js';


export default class NeonDB extends PGPool {
	constructor({domain, password}, connectionString, logger) {
		super({
			domain, password,
			name: 'neondb', dialect: 'postgresql', username: 'neondb_owner', ssl: true
		}, connectionString, logger);
	}

	get connectionString() {
		return super.connectionString + '?sslmode=require';
	}
}
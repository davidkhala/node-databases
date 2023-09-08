
import {Neo4j} from './index.js';

export class AuraDB extends Neo4j {
	constructor({instance, password}, connectionString) {
		const domain = `${instance}.databases.neo4j.io`;
		super({domain, password, dialect: 'neo4j', driver: 's'}, connectionString);

	}

	get connectionString() {
		if (this._connectionString) {
			return this._connectionString;
		}
		const {dialect, driver, domain, port: P, name: n} = this;
		return `${dialect}${driver ? '+' + driver : ''}://${domain}${P ? ':' + P : ''}${n ? '/' + n : ''}`;
	}
}
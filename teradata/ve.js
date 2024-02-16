import Teradata from './index.js';

export class VantageExpress extends Teradata {
	constructor({domain}, cursor) {
		super({domain, password: 'dbc'}, undefined, cursor);
	}
}

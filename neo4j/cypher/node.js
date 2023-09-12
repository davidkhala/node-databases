import assert from 'assert';
import {Element} from './common.js';

export class Node extends Element {
	constructor(variable = 'o', types, properties) {
		super('(', ')', variable, types, properties);

	}

	static list() {
		// RETURN * is not allowed when there are no variables in scope
		return ['MATCH (_) return *', undefined, (fields) => {
			assert.strictEqual(fields.length, 1);
			return fields[0];
		}];
	}

	create() {
		return [`CREATE ${this.q}`];
	}

}

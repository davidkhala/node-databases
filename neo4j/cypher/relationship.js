import {Element} from './common.js';
import assert from 'assert';

export class Relationship extends Element {
	constructor(variable = '_', types, properties) {

		super('[', ']', variable, types, properties);
	}


	/**
	 * Neo4j: Only directed relationships are supported in CREATE
	 * @param {Node} fromNode
	 * @param {Node} toNode
	 */
	create(fromNode, toNode) {
		assert.strictEqual(this.types.length, 1, 'Exactly one relationship type must be specified for CREATE');
		const query = `MATCH ${fromNode.q} ` + `MATCH ${toNode.q} ` +
			`CREATE (${fromNode.variable})-${this.q}->(${toNode.variable})`;
		return [query];
	}
}
import {Element} from './common.js';

export class Relationship extends Element {
	constructor(variable = '_', types, properties) {

		super('[', ']', variable, types, properties);
	}

}

export class SingleRelationship extends Relationship {

	constructor(variable, type, properties) {
		super(variable, [type], properties);
	}

	/**
	 * Neo4j: Only directed relationships are supported in CREATE
	 * Neo4j: Exactly one relationship type must be specified for CREATE
	 * @param {Node} fromNode
	 * @param {Node} toNode
	 */
	create(fromNode, toNode) {
		const query = `MATCH ${fromNode.q} ` + `MATCH ${toNode.q} ` +
			`CREATE (${fromNode.variable})-${this.q}->(${toNode.variable})`;
		return [query];
	}
}
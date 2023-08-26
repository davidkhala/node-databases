import assert from 'assert';

export const drop = 'V().drop()';


export class Vertex {
	/**
	 *
	 * @param type The Label of vertex
	 */
	constructor(type) {
		this.type = type;
	}

	list() {
		return `V().hasLabel('${this.type}')`;
	}

	hasProperty({key, value}) {
		let suffix;
		if (key) {
			suffix = `hasKey('${key}')`;
		}
		if (value) {
			suffix = `hasValue('${value}')`;
		}
		if (key && value) {
			suffix = `has('${key}','${value}')`;
		}
		return this.list() + '.' + suffix;
	}


	create(properties) {
		const propertiesQuery = Object.entries(properties).reduce((str, [key, value]) => {
			return str + `.property('${key}', '${value}')`;
		}, '');
		return `addV('${this.type}')${propertiesQuery}`;
	}

	static get(id) {
		return `V(${id})`;
	}

	static get count() {
		return 'V().count()';
	}
}


export function getIdString(vertex) {
	let id;
	if (typeof vertex === 'object') {
		assert.ok(vertex instanceof Vertex, vertex);
		id = vertex.id;
	}
	if (typeof vertex === 'string') {
		id = `'${id}'`;
	} else {
		assert.ok(typeof vertex === 'number');
		id = vertex.toString();
	}
	return id;
}

export class Edge {
	constructor(type) {
		this.type = type;
		this.childTraversalSource = '';
	}

	create(from, to) {
		return `V(${getIdString(from)}).addE('${this.type}').to(${this.childTraversalSource}V(${getIdString(to)}))`;
	}
}

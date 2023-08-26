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
		return `addV('${this.type}')${propertyFrom(properties)}`;
	}

	static get(id) {
		return `V(${id})`;
	}

	static get count() {
		return 'V().count()';
	}
}

export function propertyFrom(properties) {
	return Object.entries(properties).reduce((str, [key, value]) => {
		if (!value) {
			return str;
		}
		return str + `.property('${key}', '${value}')`;
	}, '');
}

export function getIdString(vertex) {
	let id = vertex;
	if (typeof vertex === 'object') {
		assert.ok(vertex instanceof Vertex, vertex);
		id = vertex.id;
	}
	if (typeof id === 'string') {
		id = `'${id}'`;
	} else {
		assert.ok(typeof id === 'number', id);
		id = id.toString();
	}
	return id;
}

export class Edge {
	constructor(type) {
		this.type = type;
		this.childTraversalSource = '';
	}

	create(from, to, properties = {}) {
		return `V(${getIdString(from)}).addE('${this.type}')${propertyFrom(properties)}.to(${this.childTraversalSource}V(${getIdString(to)}))`;
	}

	list() {
		return `E().hasLabel('${this.type}')`;
	}
}

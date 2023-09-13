import assert from 'assert';

export const drop = 'V().drop()';


export class Element {
	/**
	 *
	 * @param type The Label of Element
	 * @param elementType V or E
	 */
	constructor(type, elementType) {
		this.type = type;
		this.elementType = elementType;
	}

	list() {
		return `${this.elementType}().hasLabel('${this.type}')`;
	}

	create(properties) {
	}

	where(id) {
		return `${this.elementType}(${getIdString(id)})`;
	}

}



export class Vertex extends Element {

	constructor(type) {
		super(type, 'V');
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
		return `V(${getIdString(id)})`;
	}

	static get count() {
		return 'V().count()';
	}
}

export class IdVertex extends Vertex {
	constructor(type, id) {
		super(type);
		this.id = id;
	}

	create(properties) {
		const {id} = this;
		return super.create(Object.assign(properties, {id}));
	}

	where() {
		return this.hasProperty({key: 'id', value: this.id});
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

export class Edge extends Element {
	constructor(type) {
		super(type, 'E');
		this.childTraversalSource = '';
	}

	create(from, to, properties = {}) {
		return `V(${getIdString(from)}).addE('${this.type}')${propertyFrom(properties)}.to(${this.childTraversalSource}V(${getIdString(to)}))`;
	}

}

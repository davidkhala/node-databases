import {ObjectReadable} from '@davidkhala/light/format.js';

export class Element {
	/**
	 *
	 * @param {string} lb left bracket
	 * @param {string} rb right bracket
	 * @param {string} [variable]
	 * @param [types]
	 * @param {Object} [properties]
	 */
	constructor(lb, rb, variable, types = [], properties) {
		Object.assign(this, {variable, types, properties});
		this.q = `${lb} ${variable}${this.typesString} ${this.propertiesString} ${rb}`;
	}

	get typesString() {
		return this.types.map(type => `:${type}`).join('');
	}

	get propertiesString() {
		const {properties} = this;
		return properties ? ObjectReadable(properties) : '';
	}

	list() {
		return [`match ${this.q} return ${this.variable}`];
	}
}
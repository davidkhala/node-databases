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
		const propertyStr = properties ? ' ' + ObjectReadable(properties) : '';
		this.q = `${lb} ${variable}${types.map(type => `:${type}`).join('')}${propertyStr} ${rb}`;
		Object.assign(this, {variable, types});
	}
}
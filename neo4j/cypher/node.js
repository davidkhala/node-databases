import assert from 'assert';

export class Node {
	constructor(types = []) {
		this.q = `(${types.map(type => `:${type}`).join('')})`;
	}

	list() {
		// RETURN * is not allowed when there are no variables in scope
		return [`MATCH _=${this.q} return *`, undefined, (fields) => {
			assert.strictEqual(fields.length, 1);
			const {start, end, length, segments} = fields[0];
			assert.strictEqual(length, 0);
			assert.strictEqual(segments.length, 0);
			assert.deepStrictEqual(start, end);
			return start;
		}];
	}

	create() {
		return 'CREATE ' + this.q;
	}

}
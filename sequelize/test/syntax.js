import {DataTypes, modelOf} from '../index.js';
import assert from 'assert';

describe('syntax', function () {
	this.timeout(0);
	it('DataTypes', async () => {
		assert.equal(Object.keys(DataTypes).length, 47);
		assert.ok(modelOf(''));
		assert.ok(modelOf(1));
		assert.ok(modelOf({}));
		assert.ok(modelOf(true));
		assert.equal(modelOf(null), modelOf({}));
		assert.ifError(modelOf(undefined));

	});
});
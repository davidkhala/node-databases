import NeonServerless from '../index.js';
import {databases, version} from '@davidkhala/postgres-format/queries.js';
import * as assert from 'assert';

describe('pooled connection', function () {
	this.timeout(0);
	it('', async () => {
		const connectionString = `postgresql://neondb_owner:${process.env.NEON_PASSWORD}@ep-jolly-voice-a17npw2v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`;
		const neon = new NeonServerless(connectionString);
		const [vr] = await neon.query(version);
		assert.ok(vr.version);
		console.info(await neon.query(databases));
	});
});
import PostGRE from '../dml.js'
import assert from 'assert'
describe('alloy db (preview)', function () {
	this.timeout(0)
	it('connect', async () => {
		const endpoint = '10.170.0.2'

		const username = 'postgres'
		const {password} = process.env
		const pg = new PostGRE({domain: endpoint}, username, password)
		await pg.connect()
		const res = await pg.databases(true)
		assert.ok(res.includes('alloydbadmin')) // alloyDB extra database user

		await pg.disconnect()
	})
})

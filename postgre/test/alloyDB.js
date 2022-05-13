import PostGRE from '../dml.js'
describe('alloy db', function () {
	this.timeout(0)
	it('connect', async () => {
		const endpoint = '10.170.0.2'

		const username = 'postgres'
		const {password} = process.env
		const pg = new PostGRE({domain: endpoint}, username, password)
		await pg.connect()
		await pg.disconnect()
	})
})

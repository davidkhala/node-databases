import PostGRE from '../dml.js'

describe('big animal free-tier', function () {
    this.timeout(0)
    it('connect with tokens', async () => {
        const domain = 'p-l97qc3oh13.pg.biganimal.io'
        const user = 'edb_admin'
        const {password} = process.env
        const db = new PostGRE({domain}, user, password)
        await db.connect()
        const res = await db.databases()

        console.debug(res.rows)

        await db.disconnect()
    })
    it('connect with string', async () => {
        const connectionString= 'postgres://p-l97qc3oh13.pg.biganimal.io:5432/edb_admin?sslmode=require'
        const user = 'edb_admin'
        const {password} = process.env
        const db = new PostGRE({connectionString}, user, password)
        await db.connect()
        const res = await db.query('SELECT NOW()')
        console.debug(res)

        await db.disconnect()
    })
})

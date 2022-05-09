import PostGRE from '../dml.js'
import assert from "assert";

describe('big animal free-tier', function () {
    this.timeout(0)
    it('connect with tokens', async () => {
        const domain = 'p-l97qc3oh13.pg.biganimal.io'
        const user = 'edb_admin'
        const {password} = process.env
        const db = new PostGRE({domain}, user, password)
        await db.connect()
        const dbs = await db.databases(true)

        assert.ok(dbs.includes('edb'))
        assert.ok(dbs.includes(user))

        await db.disconnect()
    })
    it('connect with string', async () => {
        const connectionString = 'postgres://p-l97qc3oh13.pg.biganimal.io:5432/edb_admin?sslmode=require'
        const user = 'edb_admin'
        const {password} = process.env
        const db = new PostGRE({connectionString}, user, password)
        await db.connect()

        await db.disconnect()
    })
})



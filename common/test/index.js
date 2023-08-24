import DB from '../index.js'
import assert from "assert";

describe('connection string', () => {
    const assertConnectionString = (opts, connectionStr) => assert.strictEqual(new DB(opts).connectionString, connectionStr)
    const domain = 'localhost'
    it('default dialect', () => {
        assertConnectionString({domain}, 'db://localhost')

        class NewDB extends DB {

        }

        assert.strictEqual(new NewDB({domain}).connectionString, 'newdb://localhost')
    })
    it('mysql', () => {
        const port = 3306
        const dialect = 'mysql'
        assertConnectionString({domain, port, dialect}, 'mysql://localhost:3306')
        assertConnectionString({domain, dialect}, 'mysql://localhost')
        assert.throws(() => {
            new DB({port, dialect})
        })
        assertConnectionString({domain, port, dialect, username: 'mysql'}, 'mysql://mysql@localhost:3306')
        assertConnectionString({
            domain,
            port,
            dialect,
            username: 'mysql',
            password: 'password'
        }, 'mysql://mysql:password@localhost:3306')
        assertConnectionString({domain, port, dialect, driver:'maria'}, 'mysql+maria://localhost:3306')

    })
})
import PostGRE from './index.js'
import assert from 'assert'

export const defaultDatabases = ['template0', 'template1', 'postgres']
export default class DML extends PostGRE {
    async databases() {
        const result = await this.query('SELECT * FROM pg_database')
        for (const defaultDB of defaultDatabases) {
            assert.ok(result.rows.map(({datname}) => datname).includes(defaultDB))
        }
        return result
    }
}

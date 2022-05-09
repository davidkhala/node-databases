import PostGRE from './index.js'
import assert from 'assert'

export const defaultDatabases = ['template0', 'template1', 'postgres']
export default class DML extends PostGRE {
    async databases(nameOnly) {
        const result = await this.query('SELECT * FROM pg_database')
        const dbs = result.rows.map(({datname}) => datname)
        for (const defaultDB of defaultDatabases) {
            assert.ok(dbs.includes(defaultDB))
        }
        if(nameOnly){
            return dbs
        }

        return result
    }
}

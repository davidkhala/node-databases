import Teradata from './index.js'
import * as assert from "assert";

export class Database extends Teradata {
    use(database) {
        this.execute(`SET SESSION DATABASE ${database};`)
    }

    drop(database) {
        this.exist(database) && this.execute(`DROP DATABASE ${database}`)
    }

    exist(database) {
        const result = this.query(`SELECT * FROM DBC.DATABASESV WHERE DatabaseName='${database}'`)
        assert.ok(result.length < 2, 'No duplicated Database with same name ')
        return result.length === 1
    }

    /**
     * TODO support short form of use context database
     * @param database_name
     * @param table_name
     */
    truncate(database_name, table_name) {
        this.execute(`DELETE ${database_name}.${table_name} ALL`)
    }
}

export class Table extends Teradata {
    drop(tableName) {
        this.execute(`DROP TABLE ${tableName};`)
    }
}

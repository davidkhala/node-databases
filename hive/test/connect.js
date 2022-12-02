import {Hive, HiveDDL} from '../index.js'

const host = '168.138.166.53'
const port = 10000
const username = 'hive'
const password = 'hive'
const hive = new Hive({host, port, username, password})
describe('OCI BDS Hive Thrift Server', function () {
    this.timeout(0)

    it('get uri', () => {
        console.debug(hive.uri())
    })

    beforeEach(async () => {
        await hive.connect()
    })
    it('connect ', async () => {

        const version = await hive.version()
        console.debug(version)

    })
    it('reconnect', async () => {
        await hive.disconnect()
        await hive.connect()
    })
    it('run query', async () => {
        const statement = 'SELECT * FROM `ctm`.`web_log` LIMIT 10'
        const result = await hive.execSQL(statement)
        console.info(result)

    })
    const table = 'web_log'
    const schema = 'ctm'
    const ddl = new HiveDDL(hive, table, schema)
    it('show columns', async () => {
        const result = await ddl.listColumns()
        console.info(result)
    })
    it('drop column', async () => {
        const statement = 'ALTER TABLE `ctm`.`web_log` REPLACE COLUMNS( logtime string, loglevel string, systemmodule string,sessionid string, logtype string);'
        const result = await hive.execSQL(statement)
    })
    it('drop table', async () => {
        await ddl.dropTable()
    })

    afterEach(async () => {
        await hive.disconnect()
    })
})

describe('superset', function () {
    this.timeout(0)
    before(async () => {
        await hive.connect()
    })
    it('ping', async () => {
        await hive.execSQL('USE `default`')
        console.debug(await hive.execSQL('SELECT 1'))
        console.debug(await hive.execSQL('SHOW SCHEMAS'))
    })
    after(async () => {
        await hive.disconnect()
    })
})

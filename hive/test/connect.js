import {Hive} from '../index.js'

describe('OCI BDS Hive Thrift Server', function () {
    this.timeout(0)

    const host = '168.138.166.53'
    const port = 10000
    const username = 'hive'
    const password = 'hive'
    const hive = new Hive({host, port, username, password})
    it('connect ', async () => {
        await hive.connect({username, password})
        const version = await hive.version()
        console.debug(version)

        await hive.disconnect()
    })
    it('reconnect', async () => {
        await hive.connect()
        await hive.disconnect()
        await hive.connect()
        await hive.disconnect()
    })
    it('run query', async () => {
        await hive.connect()
        const statement = 'SELECT * FROM `ctm`.`web_log` LIMIT 10'
        const result = await hive.execSQL(statement)
        console.info(result)
        await hive.disconnect()
    })
})

import {Hive} from '../index.js'

describe('connect', function () {
    this.timeout(0)

    it('OCI BDS Hive Thrift Server', async () => {
        const host = '168.138.181.142'
        const port = 10000
        const hive = new Hive({host, port})

        const username = 'hive'
        const password = 'hive'
        await hive.connect({username, password})

        hive.disconnect()
    })
})

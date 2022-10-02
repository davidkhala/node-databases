import {Hive} from '../index.js'

describe('', function () {
    this.timeout(0)

    it('connect', async () => {
        const host = '168.138.181.142'
        const port = 10000
        const hive = new Hive({host, port})

        const username = 'hive'
        const password = 'hive'
        await hive.connect({username, password})

        hive.disconnect()
    })
})

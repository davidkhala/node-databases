import {Hive} from '../index.js'

describe('', function () {
    this.timeout(0)

    it('connect', async () => {
        const host = '168.138.181.227'
        const port = 2181
        const hive = new Hive({host, port})

        const username = 'hive'
        const password = 'hive'
        const client2 = await hive.connect({username, password})
        // console.debug(client2)
        console.debug(hive.client)
    })
})

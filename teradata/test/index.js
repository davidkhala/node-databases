import {SystemInfo} from '../index.js'

describe('Connect', function () {
    this.timeout(0)

    it('get info', async () => {
        const systemInfo = new SystemInfo({host: 'localhost'})
        systemInfo.connect()
        systemInfo.session()
        systemInfo.disconnect()
    })

})

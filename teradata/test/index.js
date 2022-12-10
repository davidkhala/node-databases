import {SystemInfo} from '../index.js'

describe('Connect', function () {
    this.timeout(0)

    it('get info', async () => {
        const systemInfo = new SystemInfo({host: '129.150.33.172'})
        systemInfo.connect()
        systemInfo.session()
        systemInfo.disconnect()
    })

})

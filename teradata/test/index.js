import Teradata, {SystemInfo} from '../index.js'

describe('Connect', function () {
    this.timeout(0)

    it('get info', async () => {
        const systemInfo = new SystemInfo({host: '192.168.3.155'})
        systemInfo.connect()
        systemInfo.session()
        systemInfo.disconnect()
    })
    after(() => {

    })
})

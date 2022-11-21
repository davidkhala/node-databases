import Teradata from '../index.js'

describe('Connect', function () {
    this.timeout(0)
    it('in vbox', async () => {
        const teradata = new Teradata({host: '192.168.3.155'})
        teradata.version()

        teradata.disconnect()
    })
})

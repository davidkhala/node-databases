import CouchBase from '../index.js'
describe('CouchBase', function () {
    this.timeout(0);
    it('connect', async ()=>{
        const username="Administrator"
        const domain='localhost'
        const password = 'couchbase'
        const cb = new CouchBase({username, password,domain})
    })
})
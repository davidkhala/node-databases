import Organization from "../organization.js";

const secret = process.env.CAPELLA_API_SECRET
describe('organization', function () {
    this.timeout(0)
    const org = new Organization(secret)
    it('list', async () => {
        const r = await org.list()
        console.log(r)
    })
})
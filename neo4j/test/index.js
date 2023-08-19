import {Neo4j} from '../index.js'

describe("", () => {
    it('AuraDB', async () => {
        const neo4j = new Neo4j({name: '9e9db278', password: 'DtStA-nHFLrwthfSla7FKwMMQxipl4utJDwug3Z9kD0'})
        await neo4j.connect()
        await neo4j.disconnect()
    })
})
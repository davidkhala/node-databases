import MySQL from '../index.js';
import {MySqlContainer} from "@testcontainers/mysql";
import {user} from '../query.js'

describe('testcontainers', function (){
    this.timeout(0);
    const password = 'password';
    let containerStarted
    before(async () => {
        const container = new MySqlContainer("mysql").withRootPassword(password)
        containerStarted = await container.start();
    })
    it('', async () => {
        const port = containerStarted.getPort()
        const mysql = new MySQL({domain: 'localhost', username:'root', password, port});
        await mysql.connect();
        await mysql.disconnect();
        const query = user.list
        const result = await containerStarted.executeQuery(query, undefined, true)
        console.debug(result)

    })
    after(async () => {
        await containerStarted.stop()
    })
})


import {createClient} from 'redis';

export default class Client {
    private client: any;

    constructor(endpoint, user, password) {

        let url = `redis://${endpoint}`
        if (password) {
            url = `redis://${user}:${password}@${endpoint}`
        }

        this.client = createClient({
            url
        })
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect()
    }
}

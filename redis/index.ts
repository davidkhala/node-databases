import {createClient} from 'redis';
import KvDB from '@davidkhala/kvdb/index.js'

export default class Client extends KvDB {
    private client: any;

    constructor({domain, port, endpoint = `${domain}:${port}`}, user, password) {
        let url = `redis://${endpoint}`
        let name
        if (password) {
            name = `${user}:${password}`
            url = `redis://${name}@${endpoint}`
        }
        super(domain, "", port);
        this.client = createClient({
            url
        })
    }

    get(key: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    set(key: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    clear(): Promise<void> {
        throw new Error('Method not implemented.');
    }


    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect()
    }
}

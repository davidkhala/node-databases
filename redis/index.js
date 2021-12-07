import { createClient } from 'redis';
import KvDB from '@davidkhala/kvdb/index.js';
export default class Client extends KvDB {
    constructor({ domain, port, endpoint = `${domain}:${port}` }, user, password) {
        let url = `redis://${endpoint}`;
        let name;
        if (password) {
            name = `${user}:${password}`;
            url = `redis://${name}@${endpoint}`;
        }
        super(domain, "", port);
        this.client = createClient({
            url
        });
    }
    get(key) {
        throw new Error('Method not implemented.');
    }
    set(key, value) {
        throw new Error('Method not implemented.');
    }
    clear() {
        throw new Error('Method not implemented.');
    }
    async connect() {
        await this.client.connect();
    }
    async disconnect() {
        await this.client.disconnect();
    }
}

import { createClient, } from 'redis';
import KvDB from '@davidkhala/kvdb/index.js';
export default class Client extends KvDB {
    constructor({ domain, port, endpoint = `${domain}:${port}` }, user, password) {
        let token = '';
        if (password) {
            token = `${user}:${password}@`;
        }
        const url = `redis://${token}${endpoint}`;
        super(domain, "", port);
        this.connection = createClient({
            url
        });
    }
    async get(key) {
        return await this.connection.get(key);
    }
    async set(key, value) {
        await this.connection.set(key, value);
    }
    async clear() {
        await this.connection.flushDb();
        return;
    }
    async connect() {
        await this.connection.connect();
    }
    async disconnect() {
        await this.connection.disconnect();
    }
}

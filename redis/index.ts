import {createClient, } from 'redis';
import KvDB from '@davidkhala/kvdb/index.js'

export default class Client extends KvDB {
    private client;

    constructor({domain, port, endpoint = `${domain}:${port}`}, user, password) {
        let token = ''
        if (password) {
            token = `${user}:${password}@`
        }

        const url = `redis://${token}${endpoint}`
        super(domain, "", port);
        this.client = createClient({
            url
        })
    }

    async get(key: string): Promise<string> {
        return await this.client.get(key)
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value)
    }

    async clear(): Promise<void> {
        await this.client.flushDb()
        return
    }


    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect()
    }
}

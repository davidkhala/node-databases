import {Level} from 'level';
import DB from '@davidkhala/db/index.js';


export default class LevelDB extends DB {
    constructor(path) {
        super({name: path}, undefined, undefined);
        this.connection = new Level(path);
    }


    async connect() {

        await this.connection.open();
        return this.connection;
    }

    async set(key, value) {
        await this.connection.put(key, value);
        return value;
    }


    async disconnect() {
        await this.connection.close();
    }

    async get(key) {
        return this.connection.get(key);
    }

    static async _next(iterator) {
        return new Promise((resolve, reject) => {
            iterator.next((err, key, value) => {
                if (err) {
                    return reject(err);
                }
                resolve({key, value});
            });
        });
    }

    static async _end(iterator) {
        return new Promise((resolve, reject) => {
            iterator.end((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    async list(opts) {

        const iterator = this.connection.iterator(opts);
        const results = [];
        const getNext = async () => {
            const {key, value} = await LevelDB._next(iterator);
            if (key) {
                results.push({key, value});
                await getNext();
            }
        };
        try {
            await getNext();
            return results;
        } finally {
            await LevelDB._end(iterator);
        }
    }

    static optionsBuilder({gt, gte, lt, lte, reverse, limit, keys, values} = {
        reverse: false,
        limit: -1,
        keys: true,
        values: true
    }) {
        return {gt, gte, lt, lte, reverse, limit, keys, values};
    }
}

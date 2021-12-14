var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.disconnect();
        });
    }
}

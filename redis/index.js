var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.client = createClient({
            url
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(key);
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.flushDb();
            return;
        });
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

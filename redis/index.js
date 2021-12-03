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
export default class Client {
    constructor(endpoint, user, password) {
        let url = `redis://${endpoint}`;
        if (password) {
            url = `redis://${user}:${password}@${endpoint}`;
        }
        this.client = createClient({
            url
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

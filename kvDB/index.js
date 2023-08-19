import DB from '@davidkhala/db/index.js';
export default class KvDB extends DB {
    constructor(domain, port, name) {
        super(domain, port, name);
    }
}

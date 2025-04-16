import couchbase from 'couchbase';
import DB from '@davidkhala/db/index.js'
export default class CouchBase extends DB {
    constructor({username, password, domain, bucket:name}, tls) {
        const dialect = tls? 'couchbases': 'couchbase';
        super({domain, name, username, password, dialect});
    }
    get connectionString() {
        if (this._connectionString) {
            return this._connectionString;
        }
        return `${this.dialect}://${this.domain}`;
    }
    async connect({scope, collection}){
        const {username, password} = this;
        this.connection = await couchbase.connect(this.connectionString,{
            username,
            password,
        })
        this.bucket = this.connection.bucket(this.name)
        this.scope = this.bucket.scope(scope)
        this.collection = this.scope.collection(collection)
    }

    async disconnect(){
        await this.connection.close()
        delete this.collection
        delete this.scope
        delete this.bucket
    }
}
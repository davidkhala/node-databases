import couchbase, {BucketManager, UserManager} from 'couchbase';
import DB, {DBA} from '@davidkhala/db/index.js'

export default class CouchBase extends DB {
    constructor({username, password, domain, bucket: name, port, tls}) {
        const dialect = tls ? 'couchbases' : 'couchbase';
        super({domain, name, username, password, dialect, port});
    }

    async connect({scope, collection} = {}) {
        const {username, password} = this;
        this.connection = await couchbase.connect(this.connectionString, {
            username,
            password,
        })
        if (this.name) {
            this.bucket = this.connection.bucket(this.name)
            this.scope = this.bucket.scope(scope)
            this.collection = this.scope.collection(collection)
        }
    }

    get connectionString() {
        if (this._connectionString) {
            return this._connectionString;
        }
        return `${this.dialect}://${this.domain}${this.port ? ':' + this.port : ''}`
    }

    get dba() {
        return new ClusterManager(this);
    }

    async disconnect() {
        await this.connection.close()
        delete this.collection
        delete this.scope
        delete this.bucket
    }
}

export class ClusterManager extends DBA {
    constructor(db) {
        super(db);
        this.bucket = new BucketManager(this.connection)
        this.users = new UserManager(this.connection)
    }

    async bucketCreate(name, memory = 256, options = {}) {
        await this.bucket.createBucket(Object.assign(options, {
            name,
            ramQuotaMB: memory
        }))
    }

    async bucketDelete(name) {
        await this.bucket.dropBucket(name)
    }

    async bucketList(nameOnly) {
        const buckets = await this.bucket.getAllBuckets()
        if (nameOnly) {
            return buckets.map(bucket => bucket.name)
        }
        return buckets
    }

    async grant(username, ...roles) {
        await this.users.upsertUser({
            username,
            roles: roles.map(name => ({name}))
        })
    }

    async clear() {
        // TODO WIP
        return Promise.resolve(undefined);
    }
}
import couchbase, {BucketManager, UserManager} from 'couchbase';
import DB, {DBA} from '@davidkhala/db/index.js'

export default class CouchBase extends DB {
    constructor({username, password, domain, bucket: name, port, tls}) {
        const dialect = tls ? 'couchbases' : 'couchbase';
        super({domain, name, username, password, dialect, port});
    }

    async connect({scope, collection, bucket} = {}) {
        const {username, password} = this;
        this.connection = await couchbase.connect(this.connectionString, {
            username,
            password,
        })

        if (bucket) {
            this.name = bucket
        }
        if (this.name) {
            this.bucket = this.connection.bucket(this.name)
            this.scope = scope ? this.bucket.scope(scope) : this.bucket.defaultScope()
            this.collection = collection ? this.scope.collection(collection) : this.bucket.defaultCollection()
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
        try {
            await this.bucket.createBucket(Object.assign(options, {
                name,
                ramQuotaMB: memory
            }))
            return true
        } catch (err) {
            const {context: {response_code, response_body}} = err
            const {errors, summaries} = JSON.parse(response_body)
            if (errors
                && errors.ramQuota === "RAM quota specified is too large to be provisioned into this cluster."
                && response_code === 400
            ) {
                return false
            }

            throw err
        }
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
        const buckets = await this.bucketList(true)
        await Promise.all(buckets.map(name => this.bucketDelete(name)))
    }
}
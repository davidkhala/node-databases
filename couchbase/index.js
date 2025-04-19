import couchbase, {BucketManager, ConflictResolutionType} from 'couchbase';
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
    }

    async bucketCreate(name, memory = 512) {
        await this.bucket.createBucket({
            conflictResolutionType: ConflictResolutionType.SequenceNumber,
            name,
            ramQuotaMB: memory
        })
    }

    async bucketDelete(name) {
        await this.bucket.dropBucket(name)
    }

    async clear() {
        // TODO WIP
        return Promise.resolve(undefined);
    }
}
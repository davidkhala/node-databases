import {API} from "./http.js";
import {minus} from "@davidkhala/light/array.js";
import {base64} from '@davidkhala/light/format.js'
import {sleep} from "@davidkhala/light/index.js";
import * as assert from "node:assert";
import {Cluster, Status} from "./cluster.js";

/**
 * @enum
 */
export const Name = {
    travel: 'travel-sample',
    game: 'gamesim-sample',
    beer: 'beer-sample',
    color: 'color-vector-sample' // newly introduced, found in paid account
}
export const calculateId = (name) => base64.encode(name)


export class Sample {
    constructor(api_secret, organizationId, projectId, clusterId) {
        this.api = new API(`/${organizationId}/projects/${projectId}/clusters/${clusterId}/sampleBuckets`, api_secret)
        this.organizationId = organizationId
        this.projectId = projectId
        this.clusterId = clusterId
    }

    static names = Object.values(Name)

    /**
     *
     * @param {Name} [names]
     */
    async preset(...names) {
        if (names.length === 0) {
            const existingNames = await this.existing()
            names = minus(Sample.names, existingNames)
        }
        let result = []
        for (const name of names) {
            result.push(await this.load(name, 10000))
        }
        return result
    }

    async load(name, interval) {
        const operator = new Cluster.Operator(this.api.secret, this.organizationId, this.projectId, this.clusterId)
        await operator.waitUntilState(Status.started)
        await this.api.post('', {name})

        if (interval) {
            while (true) {
                const {stats: {itemCount}} = await this.get(name)
                if (itemCount < 2) {
                    await sleep(interval)
                } else {
                    break;
                }
            }
        }
        return name
    }


    /**
     *
     * @param {Name} name
     */
    async get(name) {
        assert.ok(Sample.names.includes(name))
        const bucketId = calculateId(name)
        try {
            return await this.api.get(`/${bucketId}`)
        } catch (e) {
            const {statusCode, response: {data: {message}}} = e
            if (statusCode === 404 && message === 'Unable to find the specified bucket.') {
                return
            }
            throw e
        }

    }

    async list() {
        const {data} = await this.api.get('')
        return data
    }

    async existing() {
        return (await this.list()).map(_ => _.name)
    }

    async clear() {
        for (const name of await this.existing()) {
            await this.delete(name)
        }
    }

    /**
     * The bucket cannot be removed while the associated App Service app is turned off.
     */
    async delete(name, interval = 10000) {
        assert.ok(Sample.names.includes(name))
        const bucketId = calculateId(name)

        try {
            await this.api.delete(`/${bucketId}`)
        } catch (error) {


            const swallow = async () => {
                while (true) {
                    const bucket = await this.get(name)
                    if (bucket) {
                        await sleep(interval)
                    } else {
                        break;
                    }
                }
            }
            const case1 = (error) => {
                const {code, statusCode, response: {data}} = error
                return code === 'ERR_BAD_REQUEST'
                    && statusCode === 403
                    && data.code === 5032
                    && data.message === 'Unable to process request as this operation for backup is not supported for a self service trial cluster.'
            }
            const case2 = (error) => {
                // occasionally
                const {code, statusCode, response: {data}} = error
                return code === 'ERR_BAD_RESPONSE'
                    && statusCode === 500
                    && data.code === 10000
                    && data.message === 'An internal server error occurred.'

            }
            if (case1(error) || case2(error)) {
                await swallow()
                return
            }
            console.error(error)
            throw error
        }

    }
}

export class Bucket {
    constructor(api_secret, organizationId, projectId, clusterId) {
        this.api = new API(`/${organizationId}/projects/${projectId}/clusters/${clusterId}/buckets`, api_secret)
    }

    async delete(bucketId) {
        await this.api.delete(`/${bucketId}`)
    }
}
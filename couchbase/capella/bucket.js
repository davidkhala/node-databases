import {API} from "./http.js";
import {minus} from "@davidkhala/light/array.js";


/**
 * @enum
 */
export const Name = {
    travel: 'travel-sample', game: 'gamesim-sample', beer: 'beer-sample'
}

export class Sample {
    constructor(api_secret, organizationId, projectId, clusterId) {
        this.api = new API(`/${organizationId}/projects/${projectId}/clusters/${clusterId}/sampleBuckets`, api_secret)
    }

    /**
     *
     * @param {Name} [names]
     */
    async preset(...names) {
        if (names.length === 0) {
            const existing = await this.existing()
            names = minus([Name.travel, Name.game, Name.beer], existing)
        }
        let result = []
        for (const name of names) {
            const {bucketId} = await this.api.post('', {name})
            result.push({[name]: bucketId})
        }
        return result
    }

    async list() {
        const {data} = await this.api.get('')
        return data
    }

    async existing() {
        return (await this.list()).map(_ => _.name)
    }

    async clear() {
        const ids = (await this.list()).map(_ => _.id)

        for (const bucketId of ids) {
            await this.delete(bucketId)
        }
    }

    /**
     * The bucket cannot be removed while the associated App Service app is turned off.
     */
    async delete(bucketId) {
        await this.api.delete(`/${bucketId}`)
    }
}
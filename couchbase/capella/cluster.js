import {API} from "./http.js";
import * as assert from "node:assert";
import {sleep} from '@davidkhala/light/index.js'


/**
 * @enum
 */
export const status = {
    stopped: 'turnedOff',
    started: 'healthy',
    starting: 'turningOn',
    stopping: 'turningOff',
}

export class Cluster {
    constructor(api_secret, organizationId, projectId) {
        this.api = new API(`organizations/${organizationId}/projects/${projectId}/clusters`, api_secret)
    }

    async list() {
        const {data, cursor} = await this.api.get('')
        return data
    }

    async start(clusterId, turnOnLinkedAppService = false) {

        assert.equal(await this.api.post(`/${clusterId}/activationState`, {
            turnOnLinkedAppService
        }), '')
    }

    async stop(clusterId) {
        assert.equal(await this.api.delete(`/${clusterId}/activationState`), '')
    }

    async ensureStopped(clusterId) {
        const {currentState} = await this.get(clusterId)
        if (currentState === status.started) {
            await this.stop(clusterId)
        }
        if ([status.started, status.stopping].includes(currentState)) {
            await this.waitUntilState(clusterId, status.stopped)
            return true
        }
        return currentState
    }

    async ensureStarted(clusterId) {
        const {currentState} = await this.get(clusterId)
        if (currentState === status.stopped) {
            await this.start(clusterId)
        }
        if ([status.stopped, status.starting].includes(currentState)) {
            await this.waitUntilState(clusterId, status.started)
            return true
        }
        return currentState

    }

    async waitUntilState(clusterId, expected, interval = 10000) {
        while (true) {
            const {currentState} = await this.get(clusterId)
            if (currentState !== expected) {
                await sleep(interval)
            } else {
                break;
            }
        }
    }

    async get(clusterId) {
        return await this.api.get(`/${clusterId}`);
    }
}
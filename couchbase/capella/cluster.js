import {API} from "./http.js";
import * as assert from "node:assert";
import {sleep} from '@davidkhala/light/index.js'

/**
 * @enum
 */
export const Status = {
    stopped: 'turnedOff', started: 'healthy', starting: 'turningOn', stopping: 'turningOff',
}


const waitUntilState = async (getterFunc, expected, interval = 10000) => {
    while (true) {
        const {currentState} = await getterFunc()
        if (currentState !== expected) {
            await sleep(interval)
        } else {
            break;
        }
    }
}

class AbstractOperator {
    /**
     * @abstract
     */
    async start() {
    }

    /**
     * @abstract
     */
    async stop() {
    }

    async waitUntilState(expected) {
        await waitUntilState(
            async () => {
                return this.get()
            },
            expected
        )
    }

    async ensureStopped() {
        const {currentState} = await this.get()
        if (currentState === Status.started) {
            await this.stop()
        }
        if ([Status.started, Status.stopping].includes(currentState)) {
            await this.waitUntilState(Status.stopped)
            return true
        }
        return currentState
    }

    async ensureStarted() {
        const {currentState} = await this.get()
        if (currentState === Status.stopped) {
            await this.start()
        }
        if ([Status.stopped, Status.starting].includes(currentState)) {
            await this.waitUntilState(Status.started)
            return true
        }
        return currentState

    }

    /**
     * @abstract
     */
    async get() {

    }
}

export class Cluster {
    constructor(api_secret, organizationId, projectId) {
        this.api = new API(`/${organizationId}/projects/${projectId}/clusters`, api_secret)
        this.organizationId = organizationId
        this.projectId = projectId
    }

    async list() {
        const {data, cursor} = await this.api.get('')
        return data
    }

    static Operator = class extends AbstractOperator {
        /**
         *
         * @param {Cluster} cluster
         * @param clusterId
         */
        constructor(cluster, clusterId) {
            super();
            this.api = cluster.api
            this.organizationId = cluster.organizationId
            this.projectId = cluster.projectId
            this.clusterId = clusterId
        }

        get domain() {
            return this.data.connectionString
        }

        get appService() {
            return this.data.appServiceId
        }

        get appServiceOperator() {
            return new AppService.Operator(this.api.secret, this.organizationId, this.projectId, this.clusterId, this.appService)
        }

        async start(turnOnLinkedAppService = true) {
            assert.equal(await this.api.post(`/${this.clusterId}/activationState`, {
                turnOnLinkedAppService
            }), '')
        }

        async ensureStarted() {
            await super.ensureStarted();
            await this.appServiceOperator.ensureStarted()
        }

        async ensureStopped() {
            await this.appServiceOperator.ensureStopped()
            await super.ensureStopped();
        }

        async stop() {
            assert.equal(await this.api.delete(`/${this.clusterId}/activationState`), '')
        }

        async get() {
            this.data = await this.api.get(`/${this.clusterId}`);
            return this.data
        }
    }
}


export class AppService {
    constructor(api_secret, organizationId) {
        this.api = new API(`/${organizationId}/appservices`, api_secret)
    }

    async list() {
        const {data, cursor} = await this.api.get('')
        return data
    }

    static Operator = class extends AbstractOperator {
        constructor(api_secret, organizationId, projectId, clusterId, appServiceId) {
            super();
            this.api = new API(`/${organizationId}/projects/${projectId}/clusters/${clusterId}/appservices/${appServiceId}`, api_secret)
        }

        /**
         * Feature `Turn On App Service` is not available for self-service trial. Thus, you might get error with code 422
         */
        async start() {
            await this.api.post('/activationState')
        }

        async stop() {
            await this.api.delete('/activationState')
        }

        async get() {
            this.data = await this.api.get('')
            return this.data
        }

    }

}
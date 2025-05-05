import {API} from "./http.js";
import * as assert from "node:assert";
import {sleep} from '@davidkhala/light/index.js'

/**
 * @enum
 */
export const Status = {
    stopped: 'turnedOff',
    started: 'healthy',
    starting: 'turningOn',
    stopping: 'turningOff',
    rebalancing: 'rebalancing' // under data distributing. e.g. loading sample bucket
}


const waitUntilState = async (getterFunc, expected, interval = 10000) => {
    let data
    while (true) {
        data = await getterFunc()
        const {currentState} = data
        if (currentState !== expected) {
            await sleep(interval)
        } else {
            break;
        }
    }
    return data
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
        return await waitUntilState(
            async () => {
                return this.get()
            },
            expected
        )
    }

    async ensureStopped() {
        const data = await this.get()
        const {currentState} = data
        if (currentState === Status.started) {
            await this.stop()
        }
        if ([Status.started, Status.stopping].includes(currentState)) {
            return await this.waitUntilState(Status.stopped)
        }
        return data

    }

    async ensureStarted() {
        const data = await this.get()
        const {currentState} = data
        if (currentState === Status.stopped) {
            await this.start()
        }
        if ([Status.stopped, Status.starting].includes(currentState)) {
            return await this.waitUntilState(Status.started)
        }
        return data

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

        constructor(api_secret, organizationId, projectId, clusterId) {
            super();
            this.api = new API(`/${organizationId}/projects/${projectId}/clusters/${clusterId}`, api_secret)
            this.organizationId = organizationId
            this.projectId = projectId
            this.clusterId = clusterId
            this.turnOnLinkedAppService = true
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

        async start() {
            const {turnOnLinkedAppService} = this
            await this.api.post(`/activationState`, {
                turnOnLinkedAppService
            })
        }

        async ensureStarted() {
            const {support: {plan}} = await super.ensureStarted();
            if (plan === 'free') {
                await this.appServiceOperator.waitUntilState(Status.started)
            } else if (this.turnOnLinkedAppService) {
                await this.appServiceOperator.ensureStarted()
            }
        }

        async ensureStopped() {
            await super.ensureStopped();
            await this.appServiceOperator.waitUntilState(Status.stopped)
        }

        /**
         * Turning off cluster will also turn off any linked app services.
         *
         */
        async stop() {
            await this.api.delete(`/activationState`)
        }

        async get() {
            this.data = await this.api.get('');
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
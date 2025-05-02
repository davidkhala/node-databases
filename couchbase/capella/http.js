import {axiosPromise} from '@davidkhala/axios'

/**
 * API Base URL. See in https://docs.couchbase.com/cloud/management-api-reference/index.html
 * @type {string}
 */
export const BaseURL = 'https://cloudapi.cloud.couchbase.com/v4'

export class API {
    constructor(group, api_secret, options = {}) {
        this.options = Object.assign(options, {
            auth: {
                bearer: api_secret
            }
        })
        this.group = group
    }

    set group(group) {
        this.url = `${BaseURL}/${group}`
    }

    async get(path, body) {
        const url =  `${this.url}/${path}`
        await axiosPromise({url, body, method: 'GET'}, this.options)
    }
    async post(path, body) {
        const url =  `${this.url}/${path}`
        await axiosPromise({url, body, method: 'POST'}, this.options)
    }
}
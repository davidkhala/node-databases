import {axiosPromise} from '@davidkhala/axios/index.js'

/**
 * API Base URL. See in https://docs.couchbase.com/cloud/management-api-reference/index.html
 * @type {string}
 */
export const BaseURL = 'https://cloudapi.cloud.couchbase.com/v4/organizations'

export class API {
    constructor(group, api_secret, options = {}) {
        this.options = Object.assign(options, {
            auth: {
                bearer: api_secret
            }
        })
        this.secret = api_secret
        this.group = group
    }

    set group(group) {
        this.url = `${BaseURL}${group}`
    }

    async get(path, body) {
        const url = `${this.url}${path}`
        return axiosPromise({url, body, method: 'GET'}, this.options)
    }

    async post(path, body) {
        const url = `${this.url}${path}`
        return axiosPromise({url, body, method: 'POST'}, this.options)
    }

    async delete(path, body) {
        const url = `${this.url}${path}`
        return axiosPromise({url, body, method: 'DELETE'}, this.options)
    }
}


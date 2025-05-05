import {API} from "./http.js";

export const pretty = (organization) => {
    delete organization.preferences
    return organization
}

export default class Organization {
    constructor(api_secret) {
        this.api = new API('', api_secret)
    }


    async get(id) {
        return pretty(await this.api.get(`/${id}`))
    }

    async list() {
        const {data} = await this.api.get('')
        return data.map(pretty)
    }
}
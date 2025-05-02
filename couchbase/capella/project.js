import {API} from "./http.js";

export class Project {

    constructor(api_secret, organizationId) {
        this.api = new API(`organizations/${organizationId}/projects`, api_secret)
    }

    async list() {
        const {data, cursor} = await this.api.get('')
        return data
    }
}
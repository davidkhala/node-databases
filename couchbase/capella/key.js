import {API} from "./http.js";

export class API_KEY {
    constructor(API_SECRET, organizationId) {
        this.api = new API(`organizations/${organizationId}/apikeys`, API_SECRET)
    }

    async list() {
        const {data, cursor} = await this.api.get('')
        return data
    }
    async get(id){
        return await this.api.get(`/${id}`)
    }
}
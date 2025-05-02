import {API} from "./http.js";

export default class Organization {
    constructor(api_secret) {
        this.api = new API('organizations', api_secret)
    }

    async list() {
        return await this.api.get()
    }
}
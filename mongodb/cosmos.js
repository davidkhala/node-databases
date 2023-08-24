import MongoDB from './mongo.js'

export default class Cosmos extends MongoDB {

    constructor({username, password}) {
        const domain = `${username}.mongo.cosmos.azure.com`
        super({dialect: 'mongodb', domain, port: 10255, username, password})
    }

    get connectionString() {
        return super.connectionString + `?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@${this.username}@`
    }
}
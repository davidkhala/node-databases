import MongoDB from './mongo.js'

export default class Cosmos extends MongoDB {
	/**
	 *
	 * @param dbName
	 * @param token
	 * @param [maxIdleTime]
	 * @param [connectionString]
	 */
	constructor({dbName, token, maxIdleTime = 120000}, connectionString) {

		if (!connectionString) {
			connectionString = `mongodb://${dbName}:${token}@${dbName}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false${maxIdleTime ? `&maxIdleTimeMS=${maxIdleTime}` : ''}&appName=@${dbName}@`
		}

		super({}, connectionString)
	}
}
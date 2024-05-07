import MongoDB from './mongo.js';

export default class Autonomous extends MongoDB {
	constructor({username = 'ADMIN', password, domain}) {

		const uri = `mongodb://${username}:${password}@${domain}:27017/${username}?authMechanism=PLAIN&authSource=$external&ssl=true&loadBalanced=true&retryWrites=false`;

		super({}, uri);
	}

	async connect() {
		const {connection} = this;
		await connection.connect();
		this.db = connection.db();
	}

}

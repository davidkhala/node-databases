import MongoConnect from './mongo.js';

export default class AutonomousJSON extends MongoConnect {
	constructor({username = 'ADMIN', password, domain}) {

		const uri = `mongodb://${username}:${password}@${domain}:27017/${username}?authMechanism=PLAIN&authSource=$external&ssl=true&loadBalanced=true`;

		super({}, uri);
	}

	async connect() {
		const {client} = this;
		await client.connect();
		this.db = client.db();
	}

}

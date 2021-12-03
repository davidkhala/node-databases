import MongoConnect from './index.js';
import {MongoClient} from 'mongodb';

export default class AutonomousJSON extends MongoConnect {
	constructor({username = 'ADMIN', password, domain}) {
		super(domain, username, password, username);
		const uri = `mongodb://${username}:${password}@${domain}:27017/${username}?authMechanism=PLAIN&authSource=$external&ssl=true&loadBalanced=true`;
		// uri token ssl=true is required
		this.client = new MongoClient(uri, {
			useUnifiedTopology: true
		});
	}

	async connect() {
		const {client} = this;
		await client.connect();
		this.db = client.db();
	}

}

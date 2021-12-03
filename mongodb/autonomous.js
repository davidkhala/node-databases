const MongoConnect = require('./index');
const {MongoClient} = require('mongodb');

// Enable Mutual TLS (mTLS) Authentication: TLS connections allow you to connect to your Autonomous Database without a wallet

class AutonomousJSON extends MongoConnect {
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

module.exports = AutonomousJSON;

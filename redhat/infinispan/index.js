import DB from '@davidkhala/db';
import infinispan from 'infinispan';

export default class Infinispan extends DB {
	constructor({domain, port, username, password}) {
		super({domain, port, username, password});
	}

	async connect() {
		const endpoints = [{port: this.port, host: this.domain}];
		this.connection = await infinispan.client(endpoints, {});

	}

	async disconnect() {
		await this.connection?.disconnect();
	}
}


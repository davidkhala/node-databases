import {createClient} from 'redis';

interface BuildOpts {
	domain?: string;
	port?: string | number;
	endpoint?: string;
	user?: string;
	password?: string;
}

export default class Client {
	private client: any;

	constructor(opts: BuildOpts) {
		const {domain, port, user, password} = opts
		let {endpoint} = opts
		super(domain, '', port)
		if (domain) {
			endpoint = `${domain}:${port}`
		}
		let url = `redis://${endpoint}`
		if (password) {
			url = `redis://${user}:${password}@${endpoint}`
		}

		this.client = createClient({
			url
		})
	}

	async connect() {
		await this.client.connect();
	}

	async disconnect() {
		await this.client.disconnect()
	}
}

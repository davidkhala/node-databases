export default abstract class KvDB {
	domain: string;
	name: string;
	port: string | number;
	connection: any;

	protected constructor(domain: string, name: string, port: number | string) {
		Object.assign(this, {domain, name, port});

	}

	abstract async get(key: string);

	/**
     *
     * @param key
     * @param value
     * @return string return the set value
     */
	abstract async set(key: string, value: string);

	abstract async clear();

	abstract async connect();

	abstract async disconnect();
}

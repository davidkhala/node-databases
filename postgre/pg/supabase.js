import PG from './index.js';

export default class Supabase extends PG {
	/**
	 *
	 * @param user
	 * @param region
	 * @param password
	 * @param projectName
	 * @param [txMode]
	 * @param [connectionString]
	 * @param [logger]
	 */
	constructor({user, region, password, projectName}, txMode, connectionString, logger) {
		if (connectionString) {
			super({}, connectionString, logger);
		} else {
			const username = `${user}.${projectName}`;
			const domain = `${region}.pooler.supabase.com`;
			super({username, password, domain, port: txMode ? 6543 : 5432, name: user}, undefined, logger);
		}
	}
}
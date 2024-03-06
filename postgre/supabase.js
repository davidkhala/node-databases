import PostGRE from './index.js';

export default class Supabase extends PostGRE {
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
		// postgres://postgres.qplmusgcroaumzwhypmy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
		if (connectionString) {
			super({}, connectionString, logger);
		} else {
			const username = `${user}.${projectName}`;
			const domain = `${region}.pooler.supabase.com`;
			super({username, password, domain, port: txMode ? 6543 : 5432, name: user}, undefined, logger);
		}
	}
}
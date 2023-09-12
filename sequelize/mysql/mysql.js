import {AbstractSequelize} from '../index.js';


export default class MySQL extends AbstractSequelize {

	/**
	 *
	 * @param domain
	 * @param port
	 * @param name
	 * @param username
	 * @param password
	 * @param [logger]
	 */
	constructor({domain, port = 3306, name, username = 'root', password}, logger) {
		super({domain, port, name, username, password, dialect: 'mysql'}, logger);
	}

}









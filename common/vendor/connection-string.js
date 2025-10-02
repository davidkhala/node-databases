import {ConnectionString} from 'connection-string';

export const parse = (connectionString) => {
	const o = new ConnectionString(connectionString);
	const {name: domain, port} = o.hosts[0];
	const {protocol, user: username, password, params: options} = o;
	const name = o.path[0];
	const [dialect, driver]  =protocol.split('+')
	return {
		domain, port, dialect, driver, username, password, options, name
	};
};
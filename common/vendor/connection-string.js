import {ConnectionString} from 'connection-string';

export const parse = (connectionString) => {
	const o = new ConnectionString(connectionString);
	const {name: domain, port} = o.hosts[0];
	const {protocol: dialect, user: username, password, params: options} = o;
	const name = o.path[0];
	return {
		domain, port, dialect, username, password, options, name
	};
};
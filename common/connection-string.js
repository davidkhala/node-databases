import {ConnectionString} from 'connection-string';

export const build = ({dialect, driver, username: u, password: p, domain, port: P, name: n}, queries) => {
	const auth = `${u || ''}${p ? ':' + p : ''}${u ? '@' : ''}`;
	const base = `${dialect}${driver ? '+' + driver : ''}://${auth}${domain}${P ? ':' + P : ''}${n ? '/' + n : ''}`;
	if (queries) {
		return `${base}?${Object.entries(queries).map(([key, value]) => (key + '=' + value)).join('&')}`;
	} else {
		return base;
	}

};
export const parse = (str) => {
	const a = new ConnectionString(str);
	console.debug(a)
};





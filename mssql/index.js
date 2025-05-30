import {Connection} from 'tedious';
import DB from '@davidkhala/db';

export const root = 'sa';
export default class MSSQL extends DB {
    constructor({domain, port = 1433, name = 'master', username, password}) {
        super({domain, port, name, username, password});
    }

    async connect(connectTimeout = 15000) {
        const {username: userName, password, port, domain, name} = this;
        const config = {
            server: domain,
            authentication: {
                type: 'default',
                options: {userName, password}
            },
            options: {
                database: name, port, trustServerCertificate: true, encrypt: true,
                connectTimeout
            }
        };
        const connection = new Connection(config);

        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        this.connection = connection;

    }

    disconnect() {
        this.connection.close();
        delete this.connection;
    }
}


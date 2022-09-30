import hive from 'hive-driver';

const {TCLIService, TCLIService_types} = hive.thrift;


export class Hive {
    constructor({host, port}) {
        Object.assign(this, {host, port})
        this.client = new hive.HiveClient(
            TCLIService,
            TCLIService_types
        );
    }

    async connect({username, password} = {}) {
        const {host, port} = this
        const client = await this.client.connect({host, port},
            new hive.connections.TcpConnection(),
            new hive.auth.NoSaslAuthentication())


        const promiseSession = await client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V11,
            username,
            password
        });


        this.client = client
        return this
    }
}


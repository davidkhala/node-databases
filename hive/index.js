import hive from 'hive-driver';

const {TCLIService, TCLIService_types} = hive.thrift;


export class Hive {
    constructor({host, port, username, password}, logger = console) {
        Object.assign(this, {host, port, username, password, logger})
        this.client = new hive.HiveClient(
            TCLIService,
            TCLIService_types
        );
        this.utils = new hive.HiveUtils(
            TCLIService_types
        );
    }

    async connect() {
        const {host, port, username, password} = this
        const connection = new hive.connections.TcpConnection()
        const auth = username && password ? new hive.auth.PlainTcpAuthentication({
            username, password
        }) : new hive.auth.NoSaslAuthentication()
        const client = await this.client.connect({host, port}, connection, auth)
        const session = await client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V11,
        });

        this.client = client
        this.session = session
        return session
    }

    async disconnect() {
        await this.session.close();
        await this.client.close()

    }

    async execSQL(statement) {
        const {session, utils, logger} = this
        const trimmed = statement.trim().replaceAll(';', '')
        logger.debug('[execSQL]', trimmed)
        const selectDataOperation = await session.executeStatement(
            trimmed, {runAsync: true}
        );
        await utils.waitUntilReady(selectDataOperation);
        await utils.fetchAll(selectDataOperation);
        await selectDataOperation.close();

        return utils.getResult(selectDataOperation).getValue()

    }

    async version() {
        const {value} = await this.session.getInfo(TCLIService_types.TGetInfoType.CLI_DBMS_VER)
        return value.stringValue
    }

}


import hive from 'hive-driver';
import DB from '@davidkhala/db/index.js'

const {TCLIService, TCLIService_types} = hive.thrift;


export class Hive extends DB {
    constructor({host, port, username, password}, logger = console) {
        super({domain: host, port, username, password, driver: 'hive'}, undefined, logger)
        this.connection = new hive.HiveClient(
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
        const client = await this.connection.connect({host, port}, connection, auth)
        const session = await client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V11,
        });

        this.connection = client
        this.session = session
        return session
    }

    async disconnect() {
        await this.session.close();
        await this.connection.close()

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

export class HiveDDL {
    /**
     *
     * @param {Hive} hive
     * @param table
     * @param schema
     */
    constructor(hive, table, schema) {

        Object.assign(this, {
            hive,
            table: `${schema ? schema + '.' : ''}${table}`
        })

    }

    async dropTable() {
        const {hive, table} = this
        const statement = `drop table ${table}`
        await hive.execSQL(statement)
    }

    async listColumns() {
        const {hive, table} = this
        const statement = `show columns in ${table}`
        await hive.execSQL(statement)
    }
}

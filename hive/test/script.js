import hive from 'hive-driver';
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect(
    {
        host: '168.138.181.227',
        port: 2181
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(async client => {
    console.debug('200')
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    const response = await session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    );

    console.log({response})
    console.log(response.getValue());

    await session.close();
}).catch(error => {
    console.log(error);
});

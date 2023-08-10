import gremlin from "gremlin";
const {DriverRemoteConnection} = gremlin.driver

const traversal = gremlin.process.AnonymousTraversalSource.traversal;

const g = traversal().withRemote(
    new DriverRemoteConnection('ws://localhost:8182/gremlin'));

const client = new gremlin.driver.Client('ws://localhost:8182/gremlin')
client.open()


import {ContainerManager} from "@davidkhala/docker/docker.js";
import {socketPath} from "@davidkhala/docker/constants.js";
import MySQL from "../index.js";
import {docker} from "./recipe.js";

describe('docker', function () {
    this.timeout(0);
    const password = 'password';
    const manager = new ContainerManager({socketPath: socketPath()});

    const port = 3306
    const username = 'root';
    const mysql = new MySQL({domain: 'localhost', username, password, port});
    let stop;
    before(async () => {
        stop = await docker(manager, {HostPort: port, password});
    });
    it('', async () => {
        await mysql.connect();
        await mysql.disconnect();
    });

    after(async () => {
        await stop();
    });
});
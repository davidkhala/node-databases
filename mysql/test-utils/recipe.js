import {ContainerManager} from '@davidkhala/docker/docker.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import * as assert from "node:assert";

/**
 *
 * @param {ContainerManager} manager
 * @param {string|number} HostPort
 * @param {string} password
 */
export async function docker(manager, {HostPort, password}) {
    const Image = 'mysql';
    const opts = new OCIContainerOptsBuilder(Image);

    const name = Image;
    opts.setPortBind(`${HostPort}:3306`);

    opts.name = name;
    opts.env = [`MYSQL_ROOT_PASSWORD=${password}`];

    await manager.containerStart(opts.opts, true);

    const healthError = ({code, stderr}) => {
        return code === 0 && stderr === 'mysql: [Warning] Using a password on the command line interface can be insecure.\n';
    };

    const Cmd = ['mysql', '-uroot', `-p${password}`, '-e', 'select 1'];
    // wait until healthy
    while (true) {
        try {
            await manager.containerExec(name, {Cmd});
            assert.ok(false, 'Dead code line should not be reached.')
        } catch (e) {
            if (healthError(e)) {
                break;
            }
        }
    }

    const command = `ALTER USER 'root'@'%' IDENTIFIED BY '${password}';`;
    try {
        await manager.containerExec(name, {Cmd: ['mysql', '-uroot', `-p${password}`, '-e', command]});
    } catch (e) {
        if (!healthError(e)) {
            throw e;
        }
    }


    return async () => manager.containerDelete(name);
}
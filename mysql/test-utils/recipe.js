import {ContainerManager} from '@davidkhala/docker/docker.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import * as assert from "node:assert";
import {sleep} from '@davidkhala/light/index.js'

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

    const Cmd = ['mysqladmin','status', '-uroot', `-p${password}`];
    // wait until healthy
    while (!process.env.CI) {
        try {
            await manager.containerExec(name, {Cmd});
            assert.ok(false, 'Dead code line should not be reached.')
        } catch (e) {
            const {code, stderr} = e;
            if (code === 0 && stderr === 'mysqladmin: [Warning] Using a password on the command line interface can be insecure.\n') {
                break;
            }else {
                await sleep(1000)
            }
        }
    }

    const command = `ALTER USER 'root'@'%' IDENTIFIED BY '${password}';`;
    try {
        await manager.containerExec(name, {Cmd: ['mysql', '-uroot', `-p${password}`, '-e', command]});
    } catch (e) {
        const {code, stderr} = e;
        const healthyWithError = code === 0 && stderr === 'mysql: [Warning] Using a password on the command line interface can be insecure.\n';
        if (!healthyWithError) {
            throw e;
        }
    }


    return async () => manager.containerDelete(name);
}
import Path from 'path';
import {filedirname} from '@davidkhala/light/es6.mjs'
import LevelDB from '../index.js';

filedirname(import.meta)

describe('Leveldb', () => {

    it('dummy', async () => {
        const path = Path.resolve(__dirname, 'fixtures/dummy');
        const levelDB = new LevelDB(path);
        await levelDB.connect();
        await levelDB.disconnect()
    });

});

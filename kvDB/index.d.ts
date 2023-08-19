import DB from '@davidkhala/db/index.js';
export default abstract class KvDB extends DB {
    domain: string;
    name: string | undefined;
    port: string | number;
    connection: any;
    protected constructor(domain: string, port: number | string, name: string | undefined);
    abstract get(key: string): Promise<string>;
    /**
     *
     * @param key
     * @param value
     * @return string return the set value
     */
    abstract set(key: string, value: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
}

export default abstract class KvDB {
    domain: string;
    name: string;
    port: string | number;
    connection: any;
    protected constructor(domain: string, name: string, port: number | string);
    abstract get(key: string): any;
    /**
     *
     * @param key
     * @param value
     * @return string return the set value
     */
    abstract set(key: string, value: string): any;
    abstract clear(): any;
    abstract connect(): any;
    abstract disconnect(): any;
}

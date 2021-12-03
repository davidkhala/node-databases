export default abstract class KvDB {
    domain: string;
    name: string;
    port: string | number;
    connection: any;
    protected constructor(domain: string, name: string, port: number | string);
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

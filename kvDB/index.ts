export default abstract class KvDB {
    domain: string;
    // table, collection name
    name: string | undefined;
    port: string | number;
    connection: any;

    protected constructor(domain: string, port: number | string, name: string | undefined) {
        this.domain = domain
        this.port = port
        this.name = name
    }

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

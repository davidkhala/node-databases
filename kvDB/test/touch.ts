import KvDB from "../index"

class DB extends KvDB {
    clear(): Promise<void> {
        return Promise.resolve(undefined);
    }

    connect(): Promise<void> {
        return Promise.resolve(undefined);
    }

    disconnect(): Promise<void> {
        return Promise.resolve(undefined);
    }

    get(key: string): Promise<string> {
        return Promise.resolve("");
    }

    set(key: string, value: string): Promise<void> {
        return Promise.resolve(undefined);
    }

}
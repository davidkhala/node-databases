export default class Client {
    private client;
    constructor(endpoint: any, user: any, password: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

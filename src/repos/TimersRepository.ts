export default class TimersRepository implements IRepository<Timer> {
    private readonly storageKey = 'timers_storage';

    constructor(
        private readonly transport: ITransport,
        private readonly parser: IParser,
    ) { }

    async get(key: string): Promise<Timer | undefined> {
        const storage = await this.getStorage();

        if (!storage || !storage[key]) {
            return undefined;
        }

        return this.parser.parse<SerializedTimer, Timer>(storage[key]);
    }

    async getAll(): Promise<Timer[]> {
        const storage = await this.getStorage();

        if (!storage) {
            return [];
        }

        return Object.values(storage).map(timer =>
            this.parser.parse<SerializedTimer, Timer>(timer)
        );
    }

    async add(key: string, val: Timer): Promise<void> {
        const storage = await this.getStorage() ?? {};

        storage[key] = this.parser.serialize<Timer, SerializedTimer>(val);

        await this.transport.save(this.storageKey, storage);
    }

    private async getStorage(): Promise<StorageResponse<SerializedTimer> | undefined> {
        const result = await this.transport.get<StorageResponse<SerializedTimer>>(this.storageKey);

        if (result.status === 'error') {
            throw result.error;
        }

        return result.value;
    }
}
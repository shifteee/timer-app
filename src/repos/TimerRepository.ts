export default class TimerRepository implements IRepository<Timer> {
    private readonly storageKey = 'timers_storage';

    constructor(
        private readonly transport: ITransport<StorageResponse<SerializedTimer>>,
        private readonly parser: IMapper<SerializedTimer, Timer>,
    ) { }

    async get(key: string): Promise<Timer | undefined> {
        const storage = await this.getStorage();

        if (!storage || !storage[key]) {
            return undefined;
        }

        return this.parser.parse(storage[key]);
    }

    async getAll(): Promise<Timer[]> {
        const storage = await this.getStorage();

        if (!storage) {
            return [];
        }

        return Object.values(storage).map(timer =>
            this.parser.parse(timer)
        );
    }

    async add(key: string, val: Timer): Promise<void> {
        const storage = await this.getStorage() ?? {};

        storage[key] = this.parser.serialize(val);

        const res = await this.setStorage(storage);

        if (res.status === 'error') {
            throw res.error;
        }
    }

    private async getStorage(): Promise<StorageResponse<SerializedTimer> | undefined> {
        const result = await this.transport.get(this.storageKey);

        if (result.status === 'error') {
            throw result.error;
        }

        if (!result.value) {
            return {};
        }

        return result.value;
    }

    private async setStorage(val: StorageResponse<SerializedTimer>) {
        return await this.transport.save(this.storageKey, val);
    }
}
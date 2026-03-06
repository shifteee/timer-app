export default class TimerRepository implements IRepository<Timer> {
    private readonly storageKey = 'timers_storage';

    constructor(
        private readonly transport: ITransport<StorageResponse<SerializedTimer>>,
        private readonly mapper: IMapper<SerializedTimer, Timer>,
    ) { }

    async get(key: string): Promise<Timer | undefined> {
        const storage = await this.getStorage();

        if (!storage || !storage[key]) {
            return undefined;
        }

        return this.mapper.toDomain(storage[key]);
    }

    async getAll(): Promise<Timer[]> {
        const storage = await this.getStorage();

        if (!storage) {
            return [];
        }

        return Object.values(storage).map(timer =>
            this.mapper.toDomain(timer)
        );
    }

    async add(key: string, val: Timer): Promise<void> {
        const storage = await this.getStorage() ?? {};

        storage[key] = this.mapper.toStorage(val);

        const res = await this.setStorage(storage);

        if (res.status === 'error') {
            throw res.error;
        }
    }

    async remove(key: string): Promise<void> {
        const storage = await this.getStorage();

        if (!storage || Object.keys(storage).length === 0) {
            throw new Error('Delete operation failed: storage is empty');
        }

        if (!(key in storage)) {
            throw new Error(`Delete operation failed: timer "${key}" does not exist`);
        }

        delete storage[key];

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
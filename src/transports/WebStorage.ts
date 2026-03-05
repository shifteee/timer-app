export default class StorageTransport<T> implements ITransport<T> {
    async save<T, E extends Error>(key: string, value: T): Promise<Result<void, E>> {
        try {
            localStorage.setItem(key, JSON.stringify(value));

            return {
                status: 'ok',
                value: undefined,
            };
        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as Error,
            });
        }
    }

    async get<T, E extends Error>(key: string): Promise<Result<T | undefined, E>> {
        try {
            const rawData = localStorage.getItem(key);

            if (!rawData) {
                return {
                    status: 'ok',
                    value: undefined,
                };
            }

            const res = JSON.parse(rawData);

            return {
                status: 'ok',
                value: res,
            };
        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as Error,
            });
        }
    }
}
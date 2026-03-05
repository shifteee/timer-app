import { invoke } from '@tauri-apps/api';

export default class TauriTransport<T> implements ITransport<T> {
    async save<T, E extends Error>(key: string, value: T): Promise<Result<void, E>> {
        try {
            await invoke<void>('store_save', { key, value });

            return {
                status: 'ok',
                value: undefined,
            };
        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as E,
            });
        }

    }

    async get<T, E extends Error>(key: string): Promise<Result<T, E>> {
        try {
            const result = await invoke<T>('store_get', { key })

            return {
                status: 'ok',
                value: result,
            };
        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as E,
            })
        }
    }
}
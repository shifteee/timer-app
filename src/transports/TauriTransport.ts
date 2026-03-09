import { invoke } from '@tauri-apps/api/core';

export default class TauriTransport<T> implements ITransport<T> {
    async save(key: string, value: T): Promise<Result<void>> {
        try {
            await invoke("save_storage", { key, value });

            return {
                status: "ok",
                value: undefined
            };

        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as Error,
            });
        }
    }

    async get(key: string): Promise<Result<T | undefined>> {
        try {
            const result = await invoke<T>("get_storage", { key });

            return {
                status: 'ok',
                value: result,
            };
        } catch (e) {
            return Promise.reject({
                status: 'error',
                error: e as Error,
            });
        }
    }
}
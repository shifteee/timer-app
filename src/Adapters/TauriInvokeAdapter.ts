import { invoke } from '@tauri-apps/api/core';


async function tauriInvokeAdpter<T>(cmd: string, args?: Record<string, T>): Promise<Result<StorageResponse<T>>> {
    try {
        const result = await invoke<T>(cmd, args);
        
        return {
            status: 'ok',
            value: result as StorageResponse<T>,
        };
    } catch(e) {
        return {
            status: 'error',
            error: e as Error,
        };
    }
}
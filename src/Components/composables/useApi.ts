import { InjectionKey, inject } from 'vue';
import { TransportKey } from '../../transports/transport';

const transport = inject(TransportKey);

function normalizeError(error: Error | { toString(): string }): Error {
    if (error instanceof Error) {
        return error;
    }

    return new Error(String(error));
}

export default function useApi(key :string) {
    if (!transport) {
        throw new Error('transport is not injected');
    }

    async function save<T> (
        payload: T
    ) :Promise<void> {
        return transport?.save<T>(key, payload);
    }

    async function get<T>() :Promise<T> {
        return transport?.get<T>(key);
    }

    
    return {
        get,
        save,
    };
}
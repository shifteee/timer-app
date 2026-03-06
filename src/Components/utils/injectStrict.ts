import { inject, type InjectionKey } from 'vue';

export default function injectStrict<T>(key: InjectionKey<T>): T {
    const resolved = inject(key);

    if (!resolved) {
        throw new Error('Missing injection');
    }

    return resolved;
}
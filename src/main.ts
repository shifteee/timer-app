import { createApp, provide } from 'vue';

import App from './App.vue';
import StorageTransport from './transports/webStorage';
import TauriTransport from './transports/tauri';
import { TransportKey } from './transports/transport';

function isTauriRuntime(): boolean {
    if (typeof window === 'undefined') return false;
    const tauri = (window as typeof window & { __TAURI__?: { ipc?: { invoke?: unknown } } }).__TAURI__;

    return Boolean(tauri?.ipc?.invoke);
}

provide(TransportKey, isTauriRuntime() ? new TauriTransport() : new StorageTransport());

createApp(App).mount("#app");

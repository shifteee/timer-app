import { createApp } from 'vue';

import App from './App.vue';
import StorageTransport from './transports/WebStorage';
import TauriTransport from './transports/TauriTransport';
import TimerRepository from './repos/TimerRepository';
import { LuxonTimeAdapter } from './Adapters/LuxonTimeAdapter';
import TimeMapper from './Mappers/TimeMapper';
import { ReposytoryKey } from './repos/repos';

function isTauriRuntime(): boolean {
    if (typeof window === 'undefined') return false;
    const tauri = (window as typeof window & { __TAURI__?: { ipc?: { invoke?: unknown } } }).__TAURI__;

    return Boolean(tauri?.ipc?.invoke);
}

const repository = new TimerRepository(
    isTauriRuntime() ? new TauriTransport() : new StorageTransport(),
    new TimeMapper(new LuxonTimeAdapter()),
)

const app = createApp(App);

app.provide(ReposytoryKey, repository);
app.mount("#app");

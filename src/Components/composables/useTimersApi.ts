import { ref } from 'vue';
import injectStrict from '../utils/injectStrict';
import { ReposytoryKey } from '../../repos/repos';

export default function useTimersApi() {
    const repository = injectStrict(ReposytoryKey);
    const timers = ref<Timer[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function loadTimers() {
        loading.value = true;
        error.value = null;

        try {
            const result = await repository.getAll();

            timers.value = result ?? [];
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading.value = false;
        }
    }

    async function addTimer(key: string, timer: Timer) {
        loading.value = true;

        try {
            await repository.add(key, timer);
            await loadTimers();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading.value = false;
        }
    }

    async function getTimer(key: string) {
        try {
            return await repository.get(key);
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        }
    }

    async function deleteTimer(key: string) {
        try {
            await repository.remove(key);
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        }
    }

    return {
        timers,
        loading,
        error,
        loadTimers,
        addTimer,
        getTimer,
        deleteTimer,
    };
}
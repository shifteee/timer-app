<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { DateTime } from 'luxon';

import useApi from '../composables/useApi';
import Time from './Time.vue';

const timers = ref<string[]>([]);
const now = DateTime.now();

onBeforeMount(async () => {
    const api = useApi();

    try {
        const storedTimers = await api.call<string[]>('get_timers');
        
        timers.value = storedTimers;
    } catch (error) {
        console.error('Failed to load timers', error);
    }
});
</script>
<template>
<section class="timers">
    <h2>Saved timers:</h2>
    <ul>
        <li v-for="timer in timers" :key="timer">
            <Time
                :intervalIso="timer"
                :nowIso="now.toISO()"
            />
        </li>
    </ul>
</section>
</template>
<style scoped>
@reference "tailwindcss";

.timers {
    @apply col-span-4
}
</style>
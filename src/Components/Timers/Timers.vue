<script setup lang="ts">
import { onBeforeMount } from 'vue';

import Time from './Time.vue';

import useTimersApi from '../composables/useTimersApi';
import timerEventBus from '../events/timerEventBus';
import { TIMER_DELETED, TIMER_ADDED } from '../events/events';

const { loadTimers, error, timers } = useTimersApi();

timerEventBus.on(async (event) => {
    if(event === TIMER_DELETED || event === TIMER_ADDED) {
        await loadTimers();
    }
});

onBeforeMount(loadTimers);
</script>
<template>
<section class="timers">
    <h2>Saved timers:</h2>
    <ul>
        <li v-if="error">{{ error }}</li>
        <li v-for="timer in timers" :key="timer.label">
            <Time
                :label="timer.label"
                :intervalIso="timer.interval.toISO()"
            />
        </li>
    </ul>
</section>
</template>
<style scoped>
@reference "tailwindcss";

.timers {
    @apply col-span-4
        bg-white
        dark:bg-gray-800
        border
        border-gray-200
        dark:border-gray-700
        rounded-xl
        shadow-sm
        p-4;
}

.timers ul {
    @apply flex
        flex-col
        gap-2;
}
</style>
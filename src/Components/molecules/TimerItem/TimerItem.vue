<script setup lang="ts">
import { computed } from 'vue';
import { useNow } from '@vueuse/core';
import { DateTime } from 'luxon';

import useDateTime from '~/composables/useDateTime';
import useTimerApi from '~/composables/useTimersApi';

import { TIMER_DELETED } from '~/events/events';
import timerEventBus from '~/events/timerEventBus';

const props = defineProps<{
    intervalIso: string;
    label: string;
}>();
const {
    getDateTimeElements,
    getRemains,
    checkExpiration,
    getClockLikeDiff
} = useDateTime();
const now = useNow({ interval: 1000 });
const { end } = getDateTimeElements(props.intervalIso);
const nowDateTime = computed(() => DateTime.fromJSDate(now.value));
const remains = computed(() => getRemains(end, nowDateTime.value));
const isExpired = computed(() => checkExpiration(end, nowDateTime.value));
const diff = computed(() => getClockLikeDiff(remains.value));

const { error, deleteTimer } = useTimerApi();

async function handleDelete() {
    const key = props.label;
    
    await deleteTimer(key);

    timerEventBus.emit(TIMER_DELETED, key);
}
</script>
<template>
    <div class="timer" :class="{ 'timer--expired': isExpired }">
        <span v-if="error"> {{ error }}</span>
        <span class="timer__label">
            {{ label }}
        </span>

        <span class="timer__diff">
            {{ diff }}
        </span>

        <button
            class="timer__delete"
            type="button"
            @click="handleDelete"
        >
            Delete
        </button>
    </div>
</template>
<style scoped>
@reference "tailwindcss";

.timer {
    @apply flex
        items-center
        justify-between
        px-3
        py-2
        rounded-lg
        text-gray-800
        dark:text-gray-200
        hover:bg-gray-50
        dark:hover:bg-gray-700
        transition;
}

.timer--expired {
    @apply text-gray-400
        dark:text-gray-500
        line-through;
}

.timer__label {
    @apply font-medium
        text-gray-800;
}

.timer__diff {
    @apply text-sm
        text-gray-500
        tabular-nums;
}

.timer__delete {
    @apply text-sm
        text-red-500
        hover:text-red-600
        transition;
}

.timer--expired {
    @apply text-gray-400
        line-through;
}
</style>
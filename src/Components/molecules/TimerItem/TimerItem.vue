<script setup lang="ts">
import { computed } from 'vue';
import { useNow } from '@vueuse/core';

import { Trash2 } from 'lucide-vue-next';
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
const remains = computed(() => getRemains(end, now.value));
const isExpired = computed(() => checkExpiration(end, now.value));
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
        <span v-if="error">{{ error }}</span>

        <span class="timer__label">
            {{ label }}
        </span>

        <span class="timer__diff">
            {{ diff }}
        </span>

        <i
            role="button"
            tabindex="0"
            aria-label="Delete timer"
            class="timer__delete"
            @click="handleDelete"
        >
            <Trash2 />
        </i>
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
    @apply cursor-pointer text-sm
        text-red-500
        hover:text-red-600
        transition;
}
</style>
<script setup lang="ts">
import { computed } from 'vue';
import { useNow } from '@vueuse/core';

import { Trash2 } from 'lucide-vue-next';
import useDateTime from '~/composables/useDateTime';
import useTimerApi from '~/composables/useTimersApi';

import { TIMER_DELETED } from '~/events/events';
import timerEventBus from '~/events/timerEventBus';
import Button from '~/ui/button/Button.vue';

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
    <div class="timer" :class="{ 'timer_status_expired': isExpired }">
        <div class="timer__wrapper">
            <div
                v-if="error"
                class="timer__error">
                {{ error }}
            </div>
            <div class="timer__label">
                {{ label }}
            </div>
            <div class="timer__diff">
                {{ diff }}
            </div>
            <div class="timer__delete">
                <Button
                    variant="ghost"
                    size="icon"
                    @click="handleDelete"
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    </div>
</template>
<style scoped>
@reference '@/style.css';

.timer {
    @apply w-full;
}

.timer__wrapper {
    @apply flex
        gap-4
        items-center
        ;
        
}

.timer_status_expired {
    @apply text-muted-foreground line-through;
}

.timer__label {
    @apply flex-1
        text-sm font-medium truncate
        ;
}

.timer__diff {
    @apply font-mono text-lg tracking-wide text-muted-foreground
        ;
}

.timer__delete {
    @apply flex-none
        text-destructive
        transition;
}
</style>
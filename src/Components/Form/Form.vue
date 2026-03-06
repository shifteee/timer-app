<script setup lang="ts">
import { computed, ref } from 'vue';

import Selector from '../Selector/Selector.vue';

import useDateTime from '../composables/useDateTime';
import useTimersApi from '../composables/useTimersApi';

import timerEventBus from '../events/timerEventBus';
import { TIMER_ADDED } from '../events/events';

const label = ref<string>('');
const days = ref<number>();
const hours = ref<number>();
const minutes = ref<number>();
const seconds = ref<number>();
const { buildIntervalFromDuration } = useDateTime();
const { addTimer } = useTimersApi();

const interval = computed(() => buildIntervalFromDuration({
    days: days.value,
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value,
}));
const isDisabled = computed(() => {
    return !(label.value.length > 0 && (
        days.value
        || hours.value
        || minutes.value
        || seconds.value
    ) !== undefined );
});

async function save() {
    const timer :Timer = {
        label: label.value,
        interval: interval.value,
    }
    
    await addTimer(label.value, timer);

    timerEventBus.emit(TIMER_ADDED);
}

</script>
<template>
    <div class="timer-form">
        <div
            class="timer-form__item"
        >
            <input
                type="text"
                v-model="label"
                placeholder="Input label"
            />
        </div>
        <Selector
            v-model="days"
            class="timer-form__item"
            placeholder="Input days"
        />
        <Selector
            v-model="hours"
            class="timer-form__item"
            placeholder="Input hours"
        />
        <Selector
            v-model="minutes"
            class="timer-form__item"
            placeholder="Input minutes"
        />
        <Selector
            v-model="seconds"
            class="timer-form__item"
            placeholder="Input seconds"
        />
        <div
            class="timer-form__item"
        >
            <button
                :disabled="isDisabled"
                @click="save"
            >
                Сохранить
            </button>
        </div>
    </div>
</template>
<style>
@reference "tailwindcss";

.timer-form {
    @apply col-span-2
        bg-white
        border
        border-gray-200
        rounded-xl
        shadow-sm
        p-4
        grid
        grid-cols-1
        gap-3;
}

.timer-form__item input {
    @apply w-full
        border
        border-gray-200
        rounded-md
        px-3
        py-2
        text-sm
        outline-none
        focus:ring-2
        focus:ring-gray-300;
}

.timer-form__item button {
    @apply w-full
        bg-black
        text-white
        rounded-md
        py-2
        text-sm
        font-medium
        hover:bg-gray-800
        transition;
}
</style>
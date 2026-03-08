<script setup lang="ts">
import { computed, ref } from 'vue';
import { Save } from 'lucide-vue-next';

import Selector from '~/molecules/Selector/Selector.vue';
import Button from '~/ui/button/Button.vue';
import Input from '~/ui/input/Input.vue';

import useDateTime from '~/composables/useDateTime';
import useTimersApi from '~/composables/useTimersApi';

import timerEventBus from '~/events/timerEventBus';
import { TIMER_ADDED } from '~/events/events';

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
        <div class="timer-form__wrapper">
            <div
                class="timer-form__item"
            >
                <Input
                    type="text"
                    v-model="label"
                    placeholder="Input label"
                    class="timer-form__input"
                />
            </div>
            <Selector
                v-model="days"
                class="timer-form__item"
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
                <Button
                    aria-label="Submit"
                    class="timer-form__submit"
                    variant="action-primary"
                    :disabled="isDisabled"
                    @click="save"
                >
                    <Save /> Save
                </Button>
            </div>
        </div>
    </div>
</template>
<style>
@reference "@/style.css";

.timer-form__wrapper {
    @apply col-span-2
        p-4
        grid grid-cols-1 gap-3;
}

.timer-form__input {
    @apply w-full
        box-border border border-border
        rounded-md
        px-3 py-2
        text-sm
        outline-none
        focus:ring-2
}

.timer-form__submit {
    @apply w-full items-center
        transition;
}
</style>
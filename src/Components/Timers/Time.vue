<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCountdown } from '@vueuse/core';
import { DateTime, Interval } from 'luxon';

import useDateTime from '../composables/useDateTime';

const { checkExpiration, getDiff } = useDateTime();

const props = defineProps<{
    intervalIso: string;
    nowIso: string;
}>();

const isExpired = ref<boolean>(checkExpiration(props.intervalIso, props.nowIso));

useCountdown(getDiff(props.intervalIso, props.nowIso).seconds, {
    onComplete() {
        isExpired.value = true;
    },
    onTick() {

    }
});

const humanDiff = computed<string>(() => {
    const interval = Interval.fromISO(props.intervalIso);
    const end = interval.end?.toISO();

    if (isExpired) {
        return '00:00:00';
    }

    if (!end) {
        throw new Error('Wrong DateTime format');
    }

    return getDiff(props.nowIso, end).toISOTime({ suppressMilliseconds: true }) ?? '';
});
</script>
<template>
    <span>{{ humanDiff }}</span>
</template>

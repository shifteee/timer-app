<script setup lang="ts">
import { onBeforeMount } from 'vue';

import Time from '~/molecules/TimerItem/TimerItem.vue';
import {
    Item,
    ItemGroup,
    ItemActions,
 } from '~/ui/item';
import useTimersApi from '~/composables/useTimersApi';
import timerEventBus from '~/events/timerEventBus';
import { TIMER_DELETED, TIMER_ADDED } from '~/events/events';

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
    <div class="timers__wrapper">
        <div class="timers__header">Saved timers:</div>
        <ItemGroup class="timers__list">
            <Item
                v-for="timer in timers"
                :key="timer.label"
                size="sm"
            >
                <Time
                    :label="timer.label"
                    :intervalIso="timer.interval.toISO()"
                />
            </Item>
        </ItemGroup>
    </div>
</section>
</template>
<style scoped>
@reference "@/style.css";

.timers__wrapper {
    @apply flex flex-col
        gap-4
        ;
}

.timers__header {
    @apply flex
        self-center py-2
        ;
}

.timers__item {
    @apply flex
        gap-2;
}
</style>
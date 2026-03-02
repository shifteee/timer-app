<script setup lang="ts">
import { computed, ref } from "vue";

import Selector from './Components/Selector/Selector.vue';
import Timers from './Components/Timers/Timers.vue';

import useTimers from './Components/composables/useDateTime';

const days = ref<number>(0);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const timer = useTimers();

async function saveTimer() {
    // Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
    // greetMsg.value = await invoke("save_timer", { name: name.value });
}
</script>

<template>
    <div class="wrapper">
        <Selector 
            placeholder="Input days"
        />
        <Selector 
            placeholder="Input hours"
        />
        <Selector 
            placeholder="Input minutes"
        />
        <Selector 
            placeholder="Input seconds"
        />
        <Timers />
    </div>
</template>

<style>
@import "tailwindcss";
@import "tailwindcss/preflight.css" layer(base);
</style>
<style scoped>
@reference "tailwindcss";

.wrapper {
    @apply w-screen h-screen
    p-2
    grid grid-cols-4 gap-4;
}
</style>
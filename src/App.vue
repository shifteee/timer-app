<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

import Timers from './Components/organisms/TimerList/TimerList.vue';
import Form from './Components/organisms/TimerForm/TimerForm.vue';
import { computed } from 'vue';

const mode = useColorMode()
const toggleTheme = () => {
    mode.value = mode.value === 'dark'
        ? 'light'
        : 'dark'
};
const label = computed(() =>
    mode.value === 'dark'
        ? 'Light mode'
        : 'Dark mode'
);

</script>
<template>
    <main class="app">
        <h1 class="app__title">
            Timers
        </h1>
        <button
            class="theme-switcher"
            @click="toggleTheme"
        >
            {{ label }}
        </button>

        <div class="app__grid">
            <Form />
            <Timers />
        </div>
    </main>
</template>
<style>
@reference "tailwindcss";

.app {
    @apply min-h-screen
        flex flex-col
        items-center
        pt-16
        gap-10
        bg-gray-100
        dark:bg-gray-900
        transition-colors;
}

.app__header {
    @apply flex
        items-center
        gap-6;
}

.app__title {
    @apply text-3xl
        font-semibold
        text-gray-800
        dark:text-gray-100;
}

.theme-switcher {
    @apply text-sm
        px-3
        py-1
        rounded-md
        border
        border-gray-300
        dark:border-gray-600
        text-gray-700
        dark:text-gray-200
        hover:bg-gray-200
        dark:hover:bg-gray-700
        transition;
}
</style>
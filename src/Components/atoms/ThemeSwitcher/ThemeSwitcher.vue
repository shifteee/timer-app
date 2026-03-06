<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const isDark = computed({
    get: () => mode.value === 'dark',
    set: (val: boolean) => {
        mode.value = val ? 'dark' : 'light'
    }
})
</script>

<template>
    <button
        class="theme-switcher"
        @click="isDark = !isDark"
        aria-label="Toggle theme"
    >
        <span
            class="theme-switcher__icon"
            v-if="!isDark"
        >
            ☀️
        </span>

        <span
            class="theme-switcher__icon"
            v-else
        >
            🌙
        </span>
    </button>
</template>

<style scoped>
@reference "tailwindcss";

.theme-switcher {
    @apply flex items-center justify-center
        w-9 h-9
        rounded-md
        transition-colors
        bg-gray-100
        hover:bg-gray-200
        dark:bg-gray-700
        dark:hover:bg-gray-600;
}

.theme-switcher__icon {
    @apply text-sm;
}
</style>
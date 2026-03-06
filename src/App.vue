<script setup lang="ts">
import Timers from './Components/organisms/TimerList/TimerList.vue';
import Form from './Components/organisms/TimerForm/TimerForm.vue';
import ThemeSwitcher from './Components/atoms/ThemeSwitcher/ThemeSwitcher.vue';
</script>
<template>
    <main class="app">
        <header class="app__header">
            <ThemeSwitcher />
        </header>

        <div class="app__wrapper timers">
            <Form />
            <Timers/>
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

.app__wrapper {
    @apply flex 
}
</style>
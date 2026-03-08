<script setup lang="ts">
import Timers from './Components/organisms/TimerList/TimerList.vue';
import Form from './Components/organisms/TimerForm/TimerForm.vue';
import ThemeSwitcher from './Components/atoms/ThemeSwitcher/ThemeSwitcher.vue';
import Separator from '~/ui/separator/Separator.vue';
</script>
<template>
    <main class="app">
        <header class="app__header">
            <ThemeSwitcher />
        </header>

        <div class="app__wrapper">
            <Form class="app__form"/>
            <Separator
                orientation="vertical"
                class="app__separator"
            />
            <Timers class="app__timers"/>
        </div>
    </main>
</template>
<style>
@import '@/style.css';

.app {
    @apply
        bg-muted
        flex flex-col
        items-center
        pt-16 gap-10 min-h-screen min-w-screen
        transition-colors
        ;
}

.app__header {
    @apply flex
        items-center
        gap-6
        ;
}

.app__wrapper {
    @apply flex
        min-w-3/4
        bg-background
        mx-auto
        border border-border rounded-xl
        shadow-xl shadow-border
        ;
}

.app__form {
    @apply flex-none
        ;
}

.app__separator {
    @apply w-px bg-border h-auto
        ;
}

.app__timers {
    @apply flex-2
        ;
}
</style>
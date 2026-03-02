<script setup lang="ts">
const props = defineProps<{
    options :string[],
}>();
const inputValue = defineModel<string>('inputValue');
const emit = defineEmits(['selected']);

function select(index :number) {
    inputValue.value = index.toString();

    emit('selected');
}

</script>
<template>
    <Transition name="dropdown">
        <ul
            role="listbox"
            class="dropdown"
        >
            <li
                v-for="(option, index) in props.options"
                :key="`${option}-${index}`"
                role="option"
                :class="[
                    'dropdown__option',
                ]"
                @click="select(index)"
            >
                {{ option }}
            </li>

            <li
                v-if="!options.length"
                class="dropdown__empty"
            >
                No results
            </li>
        </ul>
    </Transition>
</template>
<style scoped>
@reference "tailwindcss";

.dropdown-enter-active,
.dropdown-leave-active {
  @apply transition-all duration-150 ease-out;
}

.dropdown-enter-from {
  @apply opacity-0 translate-y-1;
}

.dropdown-enter-to {
  @apply opacity-100 translate-y-0;
}

.dropdown-leave-from {
  @apply opacity-100 translate-y-0;
}

.dropdown-leave-to {
  @apply opacity-0 translate-y-1;
}

.dropdown {
    @apply absolute right-1
        z-20 mt-1 w-auto
        bg-white border border-gray-200 rounded-md
        shadow-lg
        max-h-48 overflow-auto;

}

.dropdown__option {
    @apply cursor-pointer
        px-8 py-1
        hover:bg-gray-50 transition-colors
        ;
}

</style>
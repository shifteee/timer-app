<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

import type { ComponentPublicInstance } from 'vue';

import Chevron from '~/atoms/Chevron/Chevron.vue';
import Dropdown from '~/molecules/Dropdown/Dropdown.vue';

const props = withDefaults(defineProps<{
    min? :number,
    max? :number,
    placeholder? :string,
}>(), {
    min: 0,
    max: 10,
    placeholder : 'Input value',
});
const modelValue = defineModel<number>('modelValue');
const isExpanded = ref<boolean>(false);
const dropdownEl = useTemplateRef<ComponentPublicInstance>('dropdown');

const options = (new Array(props.max - props.min))
    .fill(0)
    .map((val :undefined, index :number) => (props.min + index).toString());

watch(modelValue, (value) => {
    if (value) {
        isExpanded.value = false;
    }
});

onClickOutside(dropdownEl, (e) => {
    if (!isExpanded.value) {
        return;
    }

    e.stopPropagation();

    isExpanded.value = false;
});
</script>

<template>
    <div class="selector">
        <div class="selector__control">
            <input
                id="selector-input"
                class="selector__input"
                type="number"
                v-model="modelValue"
                :placeholder="props.placeholder"
                autocomplete="off"
                aria-controls="selector-select"
                aria-autocomplete="list"
                @click="isExpanded = isExpanded && false"
            />
            <Chevron
                v-model:expanded="isExpanded"
            />
        </div>
        <Dropdown
            ref="dropdown"
            v-if="isExpanded"
            v-model:inputValue="modelValue"
            :options="options"
            class="selector__dropdown"
        ></Dropdown>
    </div>
</template>

<style scoped>
@reference "tailwindcss";

.selector__control {
    @apply flex items-center
        border border-gray-200
        rounded-md
        px-3 py-2
        bg-white
        hover:border-gray-300
        transition;
}

.selector__input {
    @apply flex-1
        text-sm
        outline-none
        bg-transparent;
}

.selector__dropdown {
    @apply absolute
        mt-1
        w-full
        bg-white
        border
        border-gray-200
        rounded-md
        shadow-md
        z-10;
}
</style>
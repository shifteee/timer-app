<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';

import Chevron from './Chevron.vue';
import Dropdown from './Dropdown.vue';

const props = withDefaults(defineProps<{
    min? :number,
    max? :number,
    placeholder? :string,
}>(), {
    min: 0,
    max: 10,
    placeholder : 'Input value',
});
const isExpanded = ref<boolean>(false);
const inputValue = ref<string>('');
const dropdownEl = useTemplateRef<ComponentPublicInstance>('dropdown');

const options = (new Array(props.max - props.min))
    .fill(0)
    .map((val :undefined, index :number) => (props.min + index).toString());

watch(inputValue, (value) => {
    if (value && value.length) {
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
                type="text"
                v-model="inputValue"
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
            v-model:inputValue="inputValue"
            :options="options"
            class="selector__dropdown"
        ></Dropdown>
    </div>
</template>

<style scoped>
@reference "tailwindcss";

.selector {
    @apply relative;
}

.selector__control {
    @apply flex items-center
        border border-gray-300 rounded-md
        px-2 py-1
}

.selector__input {
    @apply flex-1 outline-none
}

.raw-select_visible_false {
    display: none;
}
</style>
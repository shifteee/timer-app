<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronsUpDown } from 'lucide-vue-next';

import type { ComponentPublicInstance } from 'vue';

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '~/ui/input-group';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/ui/drawer';
import {
    Item,
    ItemGroup,
} from '~/ui/item';
import Button from '~/ui/button/Button.vue';

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
const options = (new Array(props.max - props.min))
    .fill(0)
    .map((val :undefined, index :number) => (props.min + index));

function setModelValue(val :number) {
    modelValue.value = val;
}
</script>

<template>
    <Drawer class="selector">
        <InputGroup>
            <InputGroupInput
                inputmode="numeric"
                :placeholder="props.placeholder"
                v-model.number="modelValue"
                class="selector__input"
            />
            <InputGroupAddon align="inline-end">
                <DrawerTrigger>
                    <InputGroupButton>
                        <ChevronsUpDown />
                    </InputGroupButton>
                </DrawerTrigger>
            </InputGroupAddon>
        </InputGroup>
        <DrawerContent>
            <div class="selector__dropdown">
                <DrawerHeader>
                    <DrawerTitle>Quick selecion</DrawerTitle>
                    <DrawerDescription>
                        Choose one of:
                    </DrawerDescription>
                </DrawerHeader>
                <ItemGroup class="selector__list selectable-list">
                    <Item
                        v-for="(option, index) in options"
                        :key="`${option}-${index}`"
                        class="selectable-list__item"
                        size="sm"
                        role="option"
                        @click="setModelValue(option)"
                    >
                        {{ option }}
                    </Item>
                </ItemGroup>
                <DrawerFooter class="flex-row">
                    <DrawerClose as-child>
                        <Button variant="action-primary">Submit</Button>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    </Drawer>
</template>

<style scoped>
@reference "@/style.css";

.selectable-list__item {
    @apply hover:bg-secondary;
}

.selector__dropdown {
    @apply bg-background
        mx-auto w-full max-w-sm;
}
</style>
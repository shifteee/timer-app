<script setup lang="ts">
const expanded = defineModel<boolean>('expanded');

function expand() {
    expanded.value = !expanded.value;
}

</script>
<template>
	<svg
        class="chevron"
        :class="[
            expanded ? 'chevron_state_expanded' : 'chevron_state_collapsed'
        ]"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        role="button"
        tabindex="0"
        aria-haspopup="listbox"
        :aria-expanded="expanded"
        aria-controls="selector-select"
        @click.capture="expand"
    >
        <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
<style scoped>
@reference "tailwindcss";

.chevron {
    @apply cursor-pointer focus:outline-none
        transition-all duration-200 ease-in-out;
    margin-left: 8px;
    color: #666;
}

.chevron:hover {
    @apply shadow-sm bg-gray-100;
}

.chevron_state_expanded {
    @apply rotate-180;
}

.chevron_state_collapsed {
    @apply rotate-0;
}
</style>
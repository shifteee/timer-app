<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"],
  inputmode?: HTMLAttributes["inputmode"],
}>(), {
  inputmode: "text",
});
</script>

<template>
  <Input
    data-slot="input-group-control"
    :type="inputmode"
    :class="cn(
      'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
      props.class,
    )"
  />
</template>

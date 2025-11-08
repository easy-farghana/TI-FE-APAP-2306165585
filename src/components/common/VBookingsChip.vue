<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      colorClass
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  color?: string; // e.g. 'green', 'red', 'yellow', 'orange', 'gray'
}>();

const colorClass = computed(() => {
  switch (props.color) {
    case 'green': return 'bg-green-100 text-green-800';
    case 'red': return 'bg-red-100 text-red-800';
    case 'yellow': return 'bg-yellow-100 text-yellow-800';
    case 'orange': return 'bg-orange-100 text-orange-800';
    case 'blue': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
});
</script>

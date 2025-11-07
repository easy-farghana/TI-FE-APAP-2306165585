<template>
  <span
    :class="chipClass"
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ availabilityStatus: number }>();

const label = computed(() => (props.availabilityStatus === 1 ? 'Available' : 'Not Available'));
const chipClass = computed(() =>
  props.availabilityStatus === 1
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
);
</script>
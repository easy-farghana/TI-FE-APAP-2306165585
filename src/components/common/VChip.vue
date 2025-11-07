<template>
  <span
    :class="chipClass"
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{ activeStatus: number | null | undefined }>();

const label = computed(() => (props.activeStatus === 1 ? 'Active' : 'Non-Active'));
const chipClass = computed(() =>
  props.activeStatus === 1
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
);
</script>
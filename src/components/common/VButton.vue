<template>
  <button
    :type="type"
    :class="[
      'px-4 py-2 rounded-md font-medium text-sm focus:outline-none transition',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

withDefaults(defineProps<{
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>();

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-blue-500 text-white hover:bg-blue-600'
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3'
};

function handleClick(e: MouseEvent) {
  // prevent duplicate handling due to bubbling to parent elements
  e.stopPropagation();
  if ((e.target as HTMLButtonElement).disabled) return;
  emit('click', e);
}
</script>
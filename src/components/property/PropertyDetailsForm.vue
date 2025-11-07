<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Province {
  id: number;
  name: string;
}

const props = defineProps<{
  modelValue: any;
  provinces: Province[];
  propertyTypes: { value: number; label: string }[];
}>();

const emit = defineEmits(['update:modelValue']);

const update = (field: string, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-medium mb-4">Property Details</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Property Name</label>
        <input
          v-model="props.modelValue.propertyName"
          type="text"
          required
          :placeholder="`Enter Property Name`"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Type</label>
        <select
          v-model="props.modelValue.type"
          required
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Province</label>
        <select
          v-model="props.modelValue.province"
          required
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option :value="0">Select Province</option>
          <option v-for="province in props.provinces" :key="province.id" :value="province.id">
            {{ province.name }}
          </option>
        </select>
      </div>

      <div class="flex flex-col md:col-span-2">
        <label class="mb-2 text-sm font-medium text-gray-700">Address</label>
        <textarea
          v-model="props.modelValue.address"
          required
          rows="2"
          placeholder="Enter property address"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div class="flex flex-col md:col-span-2">
        <label class="mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="props.modelValue.description"
          required
          rows="3"
          placeholder="Enter property description"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
            <div v-for="(field, key) in {
        ownerId: 'Owner ID (UUID)',
        ownerName: 'Owner Name'
      }" :key="key" class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">{{ field }}</label>
        <input
          v-model="props.modelValue[key]"
          type="text"
          required
          :placeholder="`Enter ${field}`"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
</template>

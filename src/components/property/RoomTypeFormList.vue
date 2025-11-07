<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import VButton from '@/components/common/VButton.vue';

const props = defineProps<{
  roomTypes: any[];
  availableRoomTypes: string[];
}>();

const emit = defineEmits(['add-room-type', 'remove-room-type']);
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-medium">Room Types</h2>
      <VButton type="button" variant="primary" size="sm" @click="emit('add-room-type')">
        Add Room Type
      </VButton>
    </div>

    <div v-for="(roomType, index) in props.roomTypes" :key="index" class="mb-6 pb-6 border-b last:border-0">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Room Type {{ index + 1 }}</h3>
        <VButton
          type="button"
          variant="danger"
          size="sm"
          @click="emit('remove-room-type', index)"
          :disabled="props.roomTypes.length === 1"
        >
          Remove
        </VButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Name</label>
          <select
            v-model="roomType.name"
            required
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Room Type</option>
            <option v-for="type in props.availableRoomTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div v-for="field in [
          { key: 'facility', label: 'Facility', type: 'text' },
          { key: 'capacity', label: 'Capacity', type: 'number', min: 1 },
          { key: 'price', label: 'Price', type: 'number', min: 0 },
          { key: 'floor', label: 'Floor', type: 'number', min: 1 },
          { key: 'unit', label: 'Unit', type: 'number', min: 1 }
        ]" :key="field.key" class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">{{ field.label }}</label>
          <input
            v-model="roomType[field.key]"
            :type="field.type"
            :min="field.min"
            required
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex flex-col md:col-span-2">
          <label class="mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="roomType.description"
            required
            rows="2"
            placeholder="Enter room type description"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserInfo } from '@/interfaces/response/userinfo.inteface';
import { isAdmin } from '@/utils/rbac';

interface Province {
  id: number;
  name: string;
}

const props = defineProps({
  modelValue: { type: Object as () => Record<string, any>, required: true },
  provinces: { type: Array as () => Province[], default: () => [] },
  propertyTypes: {
    type: Array as () => { value: number; label: string }[],
    default: () => []
  },
  owners: { type: Array as () => UserInfo[], default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

/**
 * Helper to emit updated modelValue merging changes
 */
function emitField<K extends string, V>(field: K, value: V) {
  emit('update:modelValue', { ...(props.modelValue ?? {}), [field]: value });
}

/**
 * Computed proxies for each field used in the form.
 * Using computed with getter/setter allows using them like v-model.
 */
const propertyName = computed({
  get: () => props.modelValue?.propertyName ?? '',
  set: (v: string) => emitField('propertyName', v)
});

const type = computed({
  get: () => props.modelValue?.type ?? 1,
  set: (v: number) => emitField('type', Number(v))
});

const province = computed({
  get: () => props.modelValue?.province ?? 0,
  set: (v: number) => emitField('province', Number(v))
});

const address = computed({
  get: () => props.modelValue?.address ?? '',
  set: (v: string) => emitField('address', v)
});

const description = computed({
  get: () => props.modelValue?.description ?? '',
  set: (v: string) => emitField('description', v)
});

/**
 * Owner handling:
 * - when superadmin selects an owner, we set both ownerId and ownerName on the modelValue
 */
const ownerId = computed({
  get: () => props.modelValue?.ownerId ?? '',
  set: (v: string) => {
    const selected = props.owners.find(o => o.id === v);
    const ownerName = selected ? selected.name : props.modelValue?.ownerName ?? '';
    emit('update:modelValue', {
      ...(props.modelValue ?? {}),
      ownerId: v,
      ownerName
    });
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-medium mb-4">Property Details</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Property Name</label>
        <input
          v-model="propertyName"
          type="text"
          required
          placeholder="Enter Property Name"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Type</label>
        <select
          v-model="type"
          required
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="t in propertyTypes" :key="t.value" :value="t.value">
            {{ t.label }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Province</label>
        <select
          v-model="province"
          required
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option :value="0">Select Province</option>
          <option v-for="p in provinces" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <div class="flex flex-col md:col-span-2">
        <label class="mb-2 text-sm font-medium text-gray-700">Address</label>
        <textarea
          v-model="address"
          required
          rows="2"
          placeholder="Enter property address"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex flex-col md:col-span-2">
        <label class="mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="description"
          required
          rows="3"
          placeholder="Enter property description"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- OWNER DROPDOWN (only visible to superadmin) -->
      <div class="flex flex-col md:col-span-2" v-if="isAdmin()">
        <label class="mb-2 text-sm font-medium text-gray-700">Owner</label>
        <select
          v-model="ownerId"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Owner</option>
          <option v-for="owner in owners" :key="owner.id" :value="owner.id">
            {{ owner.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertiesStore } from '@/stores/property.store';
import { useRouter } from 'vue-router';
import VButton from '@/components/common/VButton.vue';
import VChip from '@/components/common/VChip.vue';

const propertiesStore = usePropertiesStore();
const { properties, loading, error } = storeToRefs(propertiesStore);
const router = useRouter();

// Filter states
const searchQuery = ref('');
const selectedType = ref('');
const selectedStatus = ref('');

const goToDetail = (propertyId: string) => {
  router.push(`/property/${propertyId}`);
};

const goToAdd = () => {
  router.push('/property/create');
};

onMounted(async () => {
  await propertiesStore.fetchProperties();
});

const typeLabel = (t: number) => {
  return t === 1 ? 'Hotel' : t === 2 ? 'Villa' : t === 3 ? 'Apartment' : 'Unknown';
};

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: '1', label: 'Hotel' },
  { value: '2', label: 'Villa' },
  { value: '3', label: 'Apartment' }
];

const statusTypes = [
  { value: '', label: 'All Status' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Non-Active' }
];

const filteredRows = computed(() => {
  let filtered = properties.value ?? [];

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(property => 
      property.propertyName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(property => 
      property.type === parseInt(selectedType.value)
    );
  }

  // Filter by status
  if (selectedStatus.value !== '') {
    filtered = filtered.filter(property => 
      property.activeStatus === parseInt(selectedStatus.value)
    );
  }

  return filtered;
});
</script>

<template>
  <div class="p-6 mt-16">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">All Properties</h1>
      <VButton variant="primary" @click="goToAdd">Add Property</VButton>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Search by Name</label>
            <input
            type="text"
            v-model="searchQuery"
            placeholder="Search properties..."
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Filter by Type</label>
            <select
            v-model="selectedType"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option 
                v-for="type in propertyTypes" 
                :key="type.value" 
                :value="type.value"
            >
                {{ type.label }}
            </option>
            </select>
        </div>

        <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Filter by Status</label>
            <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option 
                v-for="status in statusTypes" 
                :key="status.value" 
                :value="status.value"
            >
                {{ status.label }}
            </option>
            </select>
        </div>
    </div>

    <div v-if="loading" class="text-gray-600">Loading properties...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div v-if="!loading && filteredRows.length === 0" class="text-gray-500">
      No properties found matching your criteria.
    </div>

    <div v-if="filteredRows.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rooms</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="prop in filteredRows" :key="prop.propertyID" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ prop.propertyID }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ prop.propertyName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ typeLabel(prop.type) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ prop.totalRooms ?? 0 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <VChip :activeStatus="prop.activeStatus" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <VButton variant="info" size="sm" @click="goToDetail(prop.propertyID)">
                Detail
              </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
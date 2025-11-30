<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePropertiesStore } from '@/stores/property.store';
import { useRouter } from 'vue-router';
import axios from 'axios';
import VButton from '@/components/common/VButton.vue';
import VChip from '@/components/common/VChip.vue';

const propertiesStore = usePropertiesStore();
const { properties, loading, error } = storeToRefs(propertiesStore);
const router = useRouter();

// Filters
const searchQuery = ref('');
const selectedType = ref('');
const selectedProvince = ref('');

// Province list
const provinces = ref<{ id: number; name: string }[]>([]);

const fetchProvinces = async () => {
  try {
    const res = await axios.get('/wilayah/api/provinces.json');
    provinces.value = (res.data.data || res.data).map((p: any) => ({
      id: Number(p.code),
      name: String(p.name),
    }));
  } catch {
    console.error('Failed to load provinces');
  }
};

const goToDetail = (propertyId: string) => router.push(`/property/${propertyId}`);
const goToAdd = () => router.push('/property/create');

const fetchFiltered = () => {
  propertiesStore.fetchPropertiesFiltered({
    name: searchQuery.value || undefined,
    type: selectedType.value ? Number(selectedType.value) : undefined,
    province: selectedProvince.value ? Number(selectedProvince.value) : undefined,
  });
};

// Fetch initial data
onMounted(async () => {
  await fetchProvinces();
  await propertiesStore.fetchPropertiesFiltered({}); // initial load
});

// Refetch backend when filters change
watch([searchQuery, selectedType, selectedProvince], fetchFiltered);

const typeLabel = (t: number) =>
  t === 1 ? 'Hotel' : t === 2 ? 'Villa' : t === 3 ? 'Apartment' : 'Unknown';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: '1', label: 'Hotel' },
  { value: '2', label: 'Villa' },
  { value: '3', label: 'Apartment' },
];
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
          <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <!-- Province Filter (replacing status filter) -->
      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Filter by Province</label>
        <select
          v-model="selectedProvince"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Provinces</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
            {{ prov.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-gray-600">Loading properties...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div v-if="!loading && properties?.length === 0" class="text-gray-500">
      No properties found matching your criteria.
    </div>

    <div v-if="properties && properties.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Rooms</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="prop in properties"
            :key="prop.propertyID"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm text-gray-900">{{ prop.propertyID }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ prop.propertyName }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ typeLabel(prop.type) }}</td>
            <td class="px-6 py-4 text-sm text-center">{{ prop.totalRooms ?? 0 }}</td>

            <!-- KEEP STATUS CHIP -->
            <td class="px-6 py-4 text-sm text-center">
              <VChip :activeStatus="prop.activeStatus" />
            </td>

            <td class="px-6 py-4 text-sm text-center">
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

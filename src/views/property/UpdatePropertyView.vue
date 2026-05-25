<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertiesStore } from '@/stores/property.store';
import { toast } from 'vue-sonner';
import VButton from '@/components/common/VButton.vue';

const route = useRoute();
const router = useRouter();
const propertiesStore = usePropertiesStore();

const loading = ref(false);
const provinces = ref<{ id: number; name: string }[]>([]);
const propertyTypes = [
  { value: 1, label: 'Hotel' },
  { value: 2, label: 'Villa' },
  { value: 3, label: 'Apartment' }
];

const propertyId = String(route.params.propertyId ?? '');
const propertyForm = ref({
  propertyId: '',
  propertyName: '',
  type: 1,
  province: 0,
  address: '',
  description: ''
});

const roomTypes = ref<Array<{
  roomTypeID: string;
  facility: string;
  price: number;
  description: string;
  capacity: number;
}>>([]);

const fetchProvinces = async () => {
  try {
    const res = await fetch('/wilayah/api/provinces.json');
    const json = await res.json();
    const payload = json.data || json;
    provinces.value = Array.isArray(payload)
      ? payload.map((p: any) => ({ id: Number(p.code), name: String(p.name) }))
      : [];
  } catch {
    // silent
  }
};

const loadProperty = async (id: string) => {
  loading.value = true;
  try {
    const p = await propertiesStore.fetchPropertyById(id);
    if (!p) {
      toast.error('Property not found');
      router.push('/property');
      return;
    }

    // fill form
    propertyForm.value = {
      propertyId: p.propertyID,
      propertyName: p.propertyName,
      type: p.type ?? 1,
      province: p.province ?? 0,
      address: p.address,
      description: p.description
    };

    roomTypes.value = (p.listRoomType || []).map((rt: any) => ({
      roomTypeID: rt.roomTypeID,
      facility: rt.facility ?? '',
      price: Number(rt.price ?? 0),
      description: rt.description ?? '',
      capacity: Number(rt.capacity ?? 1)
    }));
  } catch {
    toast.error('Failed to load property');
    router.push('/property');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (!propertyId) {
    toast.error('Missing property id');
    router.push('/property');
    return;
  }
  await fetchProvinces();
  await loadProperty(propertyId);
});

const submitForm = async () => {
  loading.value = true;
  try {
    const payload = {
      property: {
        propertyId: propertyForm.value.propertyId,
        propertyName: propertyForm.value.propertyName,
        type: propertyForm.value.type,
        province: propertyForm.value.province,
        address: propertyForm.value.address,
        description: propertyForm.value.description
      },
      roomTypes: roomTypes.value.map(rt => ({
        roomTypeID: rt.roomTypeID,
        facility: rt.facility,
        price: Number(rt.price),
        description: rt.description,
        capacity: Number(rt.capacity)
      }))
    };

    await propertiesStore.updateProperty(payload);
    toast.success('Property updated');
    router.push(`/property/${propertyForm.value.propertyId}`);
  } catch {
    toast.error('Failed to update property');
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6 mt-16">Update Property - {{ propertyForm.propertyName }}</h1>

    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Property Name -->
        <div class="flex flex-col md:col-span-2">
          <label class="mb-2 text-sm font-medium text-gray-700">Property Name</label>
          <input v-model="propertyForm.propertyName" type="text" required class="px-4 py-2 border border-gray-300 rounded-md" />
        </div>

        <!-- Property Type -->
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Property Type</label>
          <select v-model="propertyForm.type" class="px-4 py-2 border border-gray-300 rounded-md">
            <option v-for="type in propertyTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </div>

        <!-- Province -->
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Province</label>
          <select v-model="propertyForm.province" class="px-4 py-2 border border-gray-300 rounded-md">
            <option value="0">-- Select Province --</option>
            <option v-for="prov in provinces" :key="prov.id" :value="prov.id">{{ prov.name }}</option>
          </select>
        </div>

        <!-- Address -->
        <div class="flex flex-col md:col-span-2">
          <label class="mb-2 text-sm font-medium text-gray-700">Address</label>
          <textarea v-model="propertyForm.address" rows="2" required class="px-4 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <!-- Description -->
        <div class="flex flex-col md:col-span-2">
          <label class="mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="propertyForm.description" rows="3" required class="px-4 py-2 border border-gray-300 rounded-md"></textarea>
        </div>
      </div>

      <!-- Room types  -->
      <div class="bg-gray-50 p-4 rounded">
        <h2 class="text-lg font-medium mb-4">Room Types</h2>
        <div v-for="(rt, idx) in roomTypes" :key="rt.roomTypeID" class="mb-4 p-4 bg-white rounded shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- roomTypeID (disabled) -->
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">Room Type ID</label>
              <input v-model="rt.roomTypeID" disabled class="px-4 py-2 border border-gray-300 rounded bg-gray-100" />
            </div>
            <!-- Capacity, Price, Facility, Description -->
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">Capacity</label>
              <input v-model.number="rt.capacity" type="number" min="1" class="px-4 py-2 border border-gray-300 rounded" />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">Price</label>
              <input v-model.number="rt.price" type="number" min="0" class="px-4 py-2 border border-gray-300 rounded" />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 text-sm font-medium text-gray-700">Facility</label>
              <input v-model="rt.facility" type="text" class="px-4 py-2 border border-gray-300 rounded" />
            </div>
            <div class="flex flex-col md:col-span-2">
              <label class="mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="rt.description" rows="2" class="px-4 py-2 border border-gray-300 rounded"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <VButton type="button" variant="secondary" @click="router.push(`/property/${propertyForm.propertyId}`)">Cancel</VButton>
        <VButton type="submit" variant="primary" :loading="loading">Update Property</VButton>
      </div>
    </form>

  </div>
</template>
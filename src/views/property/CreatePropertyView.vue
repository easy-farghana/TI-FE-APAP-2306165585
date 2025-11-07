<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { usePropertiesStore } from '@/stores/property.store';
import { getRoomTypesByPropertyType } from '@/constants/roomTypes';
import VButton from '@/components/common/VButton.vue';

import PropertyDetailsForm from '@/components/property/PropertyDetailsForm.vue';
import RoomTypeFormList from '@/components/property/RoomTypeFormList.vue';

const router = useRouter();
const propertiesStore = usePropertiesStore();
const loading = ref(false);
const provinces = ref<{ id: number; name: string }[]>([]);

const propertyForm = ref({
  propertyName: '',
  type: 1,
  address: '',
  province: 0,
  description: '',
  ownerId: '',
  ownerName: ''
});

const roomTypes = ref([
  { name: '', facility: '', capacity: 1, price: 0, floor: 1, unit: 1, description: '' }
]);

const propertyTypes = [
  { value: 1, label: 'Hotel' },
  { value: 2, label: 'Villa' },
  { value: 3, label: 'Apartment' }
];

const availableRoomTypes = computed(() =>
  [...getRoomTypesByPropertyType(propertyForm.value.type)]
);

watch(() => propertyForm.value.type, () => {
  roomTypes.value.forEach(rt => (rt.name = ''));
});

const fetchProvinces = async () => {
  try {
    const response = await axios.get('/wilayah/api/provinces.json');
    provinces.value = (response.data.data || response.data).map((p: any) => ({
      id: Number(p.code),
      name: String(p.name)
    }));
  } catch {
    toast.error('Failed to load provinces');
  }
};

const addRoomType = () => roomTypes.value.push({ name: '', facility: '', capacity: 1, price: 0, floor: 1, unit: 1, description: '' });
const removeRoomType = (i: number) => roomTypes.value.length > 1 ? roomTypes.value.splice(i, 1) : toast.error('At least one room type required');

const submitForm = async () => {
  loading.value = true;
  try {
    const payload = {
      property: { ...propertyForm.value, province: +propertyForm.value.province, type: +propertyForm.value.type },
      roomTypes: roomTypes.value.map(rt => ({ ...rt, capacity: +rt.capacity, price: +rt.price, floor: +rt.floor, unit: +rt.unit }))
    };
    await propertiesStore.createProperty(payload);
    toast.success('Property created successfully');
    router.push('/property');
  } catch {
    toast.error('Failed to create property');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProvinces);
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-semibold">Add New Property</h1>

    <PropertyDetailsForm v-model="propertyForm" :provinces="provinces" :property-types="propertyTypes" />

    <RoomTypeFormList
      :room-types="roomTypes"
      :available-room-types="availableRoomTypes"
      @add-room-type="addRoomType"
      @remove-room-type="removeRoomType"
    />

    <div class="flex justify-end space-x-4">
      <VButton variant="secondary" @click="router.push('/property')">Cancel</VButton>
      <VButton type="submit" variant="primary" :loading="loading" @click="submitForm">Create Property</VButton>
    </div>
  </div>
</template>

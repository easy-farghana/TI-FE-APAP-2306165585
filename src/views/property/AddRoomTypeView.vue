<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertiesStore } from '@/stores/property.store';
import { getRoomTypesByPropertyType } from '@/constants/roomTypes';
import { toast } from 'vue-sonner';
import VButton from '@/components/common/VButton.vue';
import RoomTypeFormList from '@/components/property/RoomTypeFormList.vue';

const route = useRoute();
const router = useRouter();
const propertiesStore = usePropertiesStore();
const loading = ref(false);

const propertyId = route.params.propertyId as string;
console.log(propertyId)
const propertyType = Number(route.query.type);

const roomTypes = ref([{
  name: '',
  facility: '',
  capacity: 1,
  price: 0,
  floor: 1,
  unit: 1,
  description: ''
}]);

const availableRoomTypes = computed(() => 
  getRoomTypesByPropertyType(propertyType)
);

const submitForm = async () => {
  loading.value = true;
  try {
    const formattedRoomTypes = roomTypes.value.map(rt => ({
      ...rt,
      capacity: Number(rt.capacity),
      price: Number(rt.price),
      floor: Number(rt.floor),
      unit: Number(rt.unit)
    }));

    // Create the correct payload structure
    const payload = {
      roomTypes: formattedRoomTypes
    };

    await propertiesStore.addRoomType(propertyId, payload);
    toast.success('Room types added successfully');
    router.push(`/property/${propertyId}`);
  } catch (error: any) {
    toast.error(`Failed to add room types: ${error}`);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="space-y-6">
      <h1 class="text-2xl font-semibold">Add Room Types</h1>

      <form @submit.prevent="submitForm">
        <RoomTypeFormList
          :room-types="roomTypes"
          :available-room-types="availableRoomTypes"
          @add-room-type="roomTypes.push({
            name: '',
            facility: '',
            capacity: 1,
            price: 0,
            floor: 1,
            unit: 1,
            description: ''
          })"
          @remove-room-type="(index) => roomTypes.splice(index, 1)"
        />

        <div class="flex justify-end space-x-4 mt-6">
          <VButton 
            type="button" 
            variant="secondary" 
            @click="router.push(`/property/${propertyId}`)"
          >
            Cancel
          </VButton>
          <VButton 
            type="submit" 
            variant="primary"
            :loading="loading"
          >
            Add Room Types
          </VButton>
        </div>
      </form>
    </div>
  </div>
</template>
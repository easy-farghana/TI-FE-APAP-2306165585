<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePropertiesStore } from '@/stores/property.store';
import VButton from '@/components/common/VButton.vue';
import VRoomChip from '@/components/common/VRoomChip.vue';
import type { PropertyResponseDTO } from '@/interfaces/response/property.interface';
import VChip from '@/components/common/VChip.vue';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'vue-sonner';
import VConfirmModal from '@/components/common/VConfirmModal.vue';
import { ro } from 'date-fns/locale';
import { isAccommodationOwner, isAdmin } from '@/utils/rbac';


interface Province {
  code: number;
  name: string;
}

const baseUrl = import.meta.env.VITE_API_URL
const showMaintenanceModal = ref(false);
const selectedRoomId = ref<string | null>(null);
const maintenanceStart = ref('');
const maintenanceEnd = ref('');

const openMaintenanceModal = (roomId: string) => {
  selectedRoomId.value = roomId;
  maintenanceStart.value = '';
  maintenanceEnd.value = '';
  showMaintenanceModal.value = true;
};

const submitMaintenance = async () => {
  if (!selectedRoomId.value) return;

  if (!maintenanceStart.value || !maintenanceEnd.value) {
    toast.error('Please fill both start and end date/time.');
    return;
  }

  const payload = {
    roomID: selectedRoomId.value,
    maintenanceStart: maintenanceStart.value,
    maintenanceEnd: maintenanceEnd.value,
  };
  console.log(payload)
  try {
    await axios.post(`${baseUrl}/property/maintenance/add`, payload);
    toast.success('Maintenance added successfully');
    showMaintenanceModal.value = false;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to add maintenance');
  }
};


const provinces = ref<Record<string, string>>({}); 

const fetchProvinces = async () => {
  try {
    const response = await axios.get('/wilayah/api/provinces.json');
    const provincesData = response.data.data || response.data;
    
    // Create a map of province code to name
    provinces.value = provincesData.reduce((acc: Record<string, string>, province: any) => {
      acc[province.code] = province.name;
      return acc;
    }, {});
    
    console.log('Provinces loaded:', provinces.value); // Debug log
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
    toast.error('Failed to load provinces');
  }
};

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertiesStore();
const { loading, error } = storeToRefs(propertyStore);
const property = ref<PropertyResponseDTO | null>(null);
const showDeleteModal = ref(false);
const propertyToDelete = ref<string | null>(null);

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss');
};

const provinceLabel = (provinceCode: string | number) => {
  const code = String(provinceCode);
  return provinces.value[code] || 'Unknown Province';
};

onMounted(async () => {
  try {
    await fetchProvinces();
    
    const propertyId = route.params.id as string;
    property.value = await propertyStore.fetchPropertyById(propertyId) as PropertyResponseDTO;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    checkInDate.value = today.toISOString().split('T')[0]!;
    checkOutDate.value = tomorrow.toISOString().split('T')[0]!;
    console.log('Property province:', property.value?.province);
    console.log('Available provinces:', Object.keys(provinces.value));
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load property details');
  }
});

const typeLabel = (type: number) => {
  return type === 1 ? 'Hotel' : type === 2 ? 'Villa' : type === 3 ? 'Apartment' : 'Unknown';
};

const checkInDate = ref('');
const checkOutDate = ref('');

const applyFilter = async () => {
  const propertyId = route.params.id as string;
  const checkInDateTime = checkInDate.value ? `${checkInDate.value}T14:00:00` : '';
  const checkOutDateTime = checkOutDate.value ? `${checkOutDate.value}T12:00:00` : '';
  await propertyStore.fetchPropertyById(propertyId, checkInDateTime, checkOutDateTime);
  toast.success('Filter applied successfully');
};

const confirmDelete = async () => {
  if (!propertyToDelete.value) return;
  
  try {
    await propertyStore.deleteProperty(propertyToDelete.value);
  } catch (error) {

  } finally {
    showDeleteModal.value = false;
    propertyToDelete.value = null;
  }
};

const handleDelete = (propertyId: string) => {
  propertyToDelete.value = propertyId;
  showDeleteModal.value = true;
};
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto mt-8">
    <div v-if="loading" class="text-center text-gray-600">Loading property details...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    
    <div v-else-if="property" class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header Section -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-3">
            Property Details: {{ property.propertyID }}
          </h1>
          <VChip :activeStatus="property.activeStatus" />
        </div>
        <div class="space-x-3">
          <VButton 
            v-if="isAdmin() || isAccommodationOwner()"
            variant="primary" 
            :disabled="property.activeStatus==0"
            @click="router.push({
              path: `/property/updateroom/${property.propertyID}`,
              query: { type: property.type }
            })"
          >
            Add Room
          </VButton>
           <VButton
            v-if="isAdmin() || isAccommodationOwner()"
            variant="warning"
            :disabled="property.activeStatus==0"
            @click="router.push({ path: `/property/update/${property.propertyID}` })"
          >
            Update Property
          </VButton>
          <VButton 
            v-if="isAdmin() || isAccommodationOwner()"
            variant="danger" 
            :disabled="property.activeStatus==0"  
            @click="handleDelete(property.propertyID)"
          >
            Delete Property
          </VButton>
        </div>
      </div>

      <!-- Property Details -->
      <div class="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Name</p>
          <p class="text-base">{{ property.propertyName }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Total Rooms</p>
          <p class="text-base">{{ property.totalRoom }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Type</p>
          <p class="text-base">{{ typeLabel(property.type) }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Income</p>
          <p class="text-base">Rp{{ property.income.toLocaleString() }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Province</p>
          <p class="text-base">{{ provinceLabel(property.province) }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Owner Name</p>
          <p class="text-base">{{ property.ownerName }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Address</p>
          <p class="text-base">{{ property.address }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Owner UUID</p>
          <p class="text-base font-mono">{{ property.ownerID }}</p>
        </div>
        <div class="col-span-2 space-y-1">
          <p class="text-sm text-gray-500">Description</p>
          <p class="text-base">{{ property.description }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Created Date</p>
          <p class="text-base">{{ formatDateTime(property.createdDate) }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Updated Date</p>
          <p class="text-base">{{ formatDateTime(property.updatedDate) }}</p>
        </div>
      </div>

      <!-- Check-in and Check-out Date Filter -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700">Check-in Date</label>
        <input type="date" v-model="checkInDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        
        <label class="block text-sm font-medium text-gray-700 mt-4">Check-out Date</label>
        <input type="date" v-model="checkOutDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        
        <VButton variant="primary" @click="applyFilter" class="mt-4">Apply Filter</VButton>
      </div>

      <!-- Room Types Section -->
      <div v-for="roomType in property.listRoomType" :key="roomType.roomTypeID" class="mb-8">
        <div class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">{{ roomType.name }}</h2>
          <div class="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
            <div class="space-y-1">
              <p class="text-sm text-gray-500">Price per Night</p>
              <p class="text-base">Rp{{ roomType.price.toLocaleString() }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500">Capacity</p>
              <p class="text-base">{{ roomType.capacity }} persons</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500">Floor</p>
              <p class="text-base">{{ roomType.floor }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500">Facilities</p>
              <p class="text-base">{{ roomType.facility }}</p>
            </div>
          </div>

          <!-- Rooms Table -->
          <table class="min-w-full divide-y divide-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="room in roomType.listRoom" :key="room.roomID" class="hover:bg-gray-50">
                <td class="px-4 py-3">{{ room.roomID }}</td>
                <td class="px-4 py-3">{{ room.name }}</td>
                <td class="px-4 py-3 text-center">
                  <VRoomChip :availabilityStatus="room.availabilityStatus" />
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="space-x-2">
                  <VButton 
                    variant="info" 
                    size="sm"
                    :disabled="room.availabilityStatus === 0"
                    @click="router.push({
                      name: 'bookings-create-a',
                      params: { 
                        propertyID: property.propertyID,
                        roomID: room.roomID, 
                        roomName: room.name, 
                        roomTypeID: roomType.roomTypeID, 
                        capacity: roomType.capacity 
                      }
                    })"
                  >
                    Book
                  </VButton>

                  <VButton 
                    variant="warning" 
                    size="sm"
                    :disabled="property.activeStatus === 0 || room.availabilityStatus === 0"
                    @click="openMaintenanceModal(room.roomID)"
                  >
                    Maintenance
                  </VButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <VButton variant="secondary" @click="router.push('/property')">Back</VButton>
    </div>
    <VConfirmModal
      :show="showDeleteModal"
      title="Delete Property"
      message="Are you sure you want to delete this property? This action cannot be undone."
      confirm-label="Delete"
      cancel-label="Cancel"
      :danger="true"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

  <!-- Maintenance Modal -->
  <div 
    v-if="showMaintenanceModal" 
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Add Maintenance Schedule</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Start Date & Time</label>
        <input 
          type="datetime-local" 
          v-model="maintenanceStart" 
          class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">End Date & Time</label>
        <input 
          type="datetime-local" 
          v-model="maintenanceEnd" 
          class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <VButton variant="secondary" @click="showMaintenanceModal = false">Cancel</VButton>
        <VButton variant="primary" @click="submitMaintenance">Submit</VButton>
      </div>
    </div>
  </div>

  </div>
</template>
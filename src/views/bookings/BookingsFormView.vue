<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePropertiesStore } from '@/stores/property.store';
import { useBookingStore } from '@/stores/booking.store';
import { toast } from 'vue-sonner';
import type { AddBookingRequest } from '@/interfaces/request/add.booking.interface';
import { useRouter, useRoute } from 'vue-router';
import VButton from '@/components/common/VButton.vue';

const propertiesStore = usePropertiesStore();
const bookingStore = useBookingStore();
const router = useRouter();
const route = useRoute();

const bookingID = route.params.bookingID as string | undefined;
const isUpdateMode = !!bookingID;

const form = ref<AddBookingRequest>({
  roomID: '',
  checkInDate: '',
  checkOutDate: '',
  capacity: 1,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  isBreakfast: false,
});

const selectedPropertyId = ref('');
const selectedRoomTypeId = ref('');
const roomTypes = ref<any[]>([]);
const rooms = ref<any[]>([]);
const checkInDate = ref('');
const checkOutDate = ref('');
const disableSelection = ref(false); 

watch(checkInDate, (val) => {
  if (val) form.value.checkInDate = `${val}T14:00:00`;
});
watch(checkOutDate, (val) => {
  if (val) form.value.checkOutDate = `${val}T12:00:00`;
});

onMounted(async () => {
  await propertiesStore.fetchPropertiesFiltered({}); 

  if (isUpdateMode && bookingID) {
    let bookingData = history.state.booking || await bookingStore.fetchBookingById(bookingID);
    if (!bookingData) return;
    console.log(bookingData);
    // Populate form
    form.value = {
      roomID: bookingData.roomID,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      capacity: bookingData.capacity,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      isBreakfast: bookingData.breakfast ?? false,
    };

    checkInDate.value = bookingData.checkInDate?.split('T')[0] || '';
    checkOutDate.value = bookingData.checkOutDate?.split('T')[0] || '';
    selectedPropertyId.value = bookingData.propertyID;

    await onPropertyChange();

    selectedRoomTypeId.value = bookingData.roomTypeID;
    await onRoomTypeChange();

    form.value.roomID = bookingData.roomID;
    disableSelection.value = true; 
  }
});

async function onPropertyChange() {
  const property = await propertiesStore.fetchPropertyById(selectedPropertyId.value);
  const types = property?.listRoomType ?? [];

  const grouped: Record<string, any> = {};
  types.forEach(rt => {
    if (!grouped[rt.name]) {
      grouped[rt.name] = { ...rt, listRoom: [...(rt.listRoom ?? [])] };
    } else {
      grouped[rt.name].listRoom.push(...(rt.listRoom ?? []));
    }
  });

  roomTypes.value = Object.values(grouped);
  rooms.value = [];
  if (!disableSelection.value) form.value.roomID = ''; 
}

function onRoomTypeChange() {
  const roomType = roomTypes.value.find(rt => rt.roomTypeID === selectedRoomTypeId.value);
  rooms.value = roomType?.listRoom ?? [];

  if (!isUpdateMode) {
    form.value.roomID = '';
  }
}

async function submitBooking() {
  if (!form.value.roomID) return toast.error('Please select a room');
  if (!form.value.checkInDate || !form.value.checkOutDate)
    return toast.error('Please select check-in and check-out dates');

  let res;
  if (isUpdateMode && bookingID) {
    res = await bookingStore.updateBooking(bookingID, form.value);
  } else {
    res = await bookingStore.createBooking(form.value);
  }

  if (res != null) {
    router.push('/bookings');
  }
}
</script>


<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-16 mb-12">
    <h2 class="text-xl font-semibold mb-4">
      {{ isUpdateMode ? 'Update Booking' : 'Create New Booking' }}
    </h2>

    <form @submit.prevent="submitBooking" class="space-y-4">
    <!-- Property -->
    <div>
      <label class="block text-sm font-medium mb-1">Property</label>
      <select
        v-model="selectedPropertyId"
        @change="onPropertyChange"
        class="w-full border rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="disableSelection"
      >
        <option value="">Select property</option>
        <option
          v-for="p in propertiesStore.properties"
          :key="p.propertyID"
          :value="p.propertyID"
        >
          {{ p.propertyName }}
        </option>
      </select>
    </div>

    <!-- Room Type -->
    <div>
      <label class="block text-sm font-medium mb-1">Room Type</label>
      <select
        v-model="selectedRoomTypeId"
        @change="onRoomTypeChange"
        class="w-full border rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedPropertyId || disableSelection"
      >
        <option value="">Select room type</option>
        <option
          v-for="rt in roomTypes"
          :key="rt.roomTypeID"
          :value="rt.roomTypeID"
        >
          {{ rt.name }}
        </option>
      </select>
    </div>

    <!-- Room -->
    <div>
      <label class="block text-sm font-medium mb-1">Room</label>
      <select
        v-model="form.roomID"
        class="w-full border rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedRoomTypeId || disableSelection"
      >
        <option value="">Select room</option>
        <option v-for="r in rooms" :key="r.roomID" :value="r.roomID">
          {{ r.name }}
        </option>
      </select>
    </div>


      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Check-in Date</label>
          <input
            type="date"
            v-model="checkInDate"
            class="w-full border rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Check-out Date</label>
          <input
            type="date"
            v-model="checkOutDate"
            class="w-full border rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <!-- Capacity -->
      <div>
        <label class="block text-sm font-medium mb-1">Capacity</label>
        <input
          type="number"
          v-model="form.capacity"
          min="1"
          class="w-full border rounded-md p-2"
        />
      </div>

      <!-- Customer Info -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Customer Name</label>
          <input v-model="form.customerName" type="text" class="w-full border rounded-md p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Customer Email</label>
          <input v-model="form.customerEmail" type="email" class="w-full border rounded-md p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input v-model="form.customerPhone" type="text" class="w-full border rounded-md p-2" />
        </div>
      </div>

      <!-- Breakfast -->
    <label class="block text-sm font-medium mb-1">Include Breakfast</label>
        <select v-model="form.isBreakfast" class="w-full border rounded-md p-2">
        <option :value="true">Yes</option>
        <option :value="false">No</option>
    </select>


      <!-- Submit -->
      <div class="flex items-center justify-end space-x-4 pt-4">
        <VButton
          type="button"
          variant="secondary"
          size="lg"
          @click="router.push('/bookings')"
        >
          Cancel
        </VButton>
        <VButton
          type="submit"
          variant="primary"
          size="lg"
        >
          {{ isUpdateMode ? 'Update Booking' : 'Create Booking' }}
        </VButton>
      </div>
    </form>
  </div>
</template>

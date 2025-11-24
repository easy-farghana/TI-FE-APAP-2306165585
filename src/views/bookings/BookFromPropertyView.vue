<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useBookingStore } from '@/stores/booking.store';
import type { AddBookingRequest } from '@/interfaces/request/add.booking.interface';
import VButton from '@/components/common/VButton.vue';
import { formatISO, addDays } from 'date-fns';

// --- Setup store & router
const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

// --- Room data from route params or history.state
const propertyID = ref<string>(route.params.propertyID as string || '');
const roomID = ref<string>(route.params.roomID as string || '');
const roomName = ref<string>(route.params.roomName as string || '');
const roomTypeID = ref<string>(route.params.roomTypeID as string || '');
const capacity = ref<string>(route.params.capacity as string || '');

// --- Dates: default today 14:00 and tomorrow 12:00
const today = new Date();
const checkInBase = new Date(today.setHours(14, 0, 0, 0)); // today 14:00
const checkOutBase = addDays(new Date(today.setHours(12, 0, 0, 0)), 1); // tomorrow 12:00

const checkInDate = ref(formatISO(checkInBase, { representation: 'date' }));
const checkOutDate = ref(formatISO(checkOutBase, { representation: 'date' }));

// --- Form object
const form = ref<AddBookingRequest>({
  roomID: roomID.value,
  checkInDate: `${checkInDate.value}T14:00:00`,
  checkOutDate: `${checkOutDate.value}T12:00:00`,
  capacity: Number(capacity.value),
  customerID: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  isBreakfast: false,
});

// --- Update form dates on input change
function updateCheckIn(val: string) {
  form.value.checkInDate = `${val}T14:00:00`;
}
function updateCheckOut(val: string) {
  form.value.checkOutDate = `${val}T12:00:00`;
}

// --- Submit booking
async function submitBooking() {

    console.log(form.value);
    if (!form.value.customerName || !form.value.customerEmail)
        return toast.error('Please fill customer info');

    const res = await bookingStore.createBooking(form.value);
    if (res != null) {
        toast.success('Booking created successfully');
        router.push('/bookings');
    }
}

onMounted(() => {
  // sync check-in/out dates in form
  updateCheckIn(checkInDate.value);
  updateCheckOut(checkOutDate.value);
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-16 mb-12">
    <h2 class="text-xl font-semibold mb-4">Create Booking</h2>

    <form @submit.prevent="submitBooking" class="space-y-4">

      <!-- Room Info (Disabled) -->
      <div>
        <label class="block text-sm font-medium mb-1">Room ID</label>
        <input
          type="text"
          v-model="form.roomID"
          class="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          disabled
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Room Name</label>
        <input
          type="text"
          v-model="roomName"
          class="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          disabled
        />
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Check-in Date</label>
          <input
            type="date"
            v-model="checkInDate"
            @change="updateCheckIn(checkInDate)"
            class="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Check-out Date</label>
          <input
            type="date"
            v-model="checkOutDate"
            @change="updateCheckOut(checkOutDate)"
            class="w-full border rounded-md p-2"
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
          <label class="block text-sm font-medium mb-1">Customer ID</label>
          <input
            v-model="form.customerID"
            type="text"
            placeholder="Enter customer ID"
            class="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Customer Name</label>
          <input
            v-model="form.customerName"
            type="text"
            class="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Customer Email</label>
          <input
            v-model="form.customerEmail"
            type="email"
            class="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input
            v-model="form.customerPhone"
            type="text"
            class="w-full border rounded-md p-2"
          />
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
          @click="router.back()"
        >
          Cancel
        </VButton>
        <VButton
          type="submit"
          variant="primary"
          size="lg"
        >
          Create Booking
        </VButton>
      </div>
    </form>
  </div>
</template>

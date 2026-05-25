<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBookingStore } from '@/stores/booking.store';
import { useRouter } from 'vue-router';
import VButton from '@/components/common/VButton.vue';
import VBookingsChip from '@/components/common/VBookingsChip.vue';
import { isCustomer } from '@/utils/rbac';


const bookingStore = useBookingStore();
const { bookings, loading, error } = storeToRefs(bookingStore);
const router = useRouter();

const searchQuery = ref('');
const selectedStatus = ref('');

// Filters
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: '0', label: 'Waiting for Payment' },
  { value: '1', label: 'Payment Confirmed' },
  { value: '2', label: 'Cancelled' },
  { value: '3', label: 'Request Refund' },
  { value: '4', label: 'Done' },
];

const goToDetail = (bookingID: string) => {
  router.push(`/bookings/${bookingID}`);
};

const goToAdd = () => {
  router.push('/bookings/create');
};

// Fetch data on mount
onMounted(async () => {
  await bookingStore.fetchBookings();
});

// Computed filter
const filteredRows = computed(() => {
  let filtered = bookings.value ?? [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(b =>
      b.roomName.toLowerCase().includes(query) ||
      b.propertyName!.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value !== '') {
    filtered = filtered.filter(b => b.status === parseInt(selectedStatus.value));
  }

  return filtered;
});

// Format dates
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
};

// Chip color/status mapping
const getStatusColor = (status: number) => {
  switch (status) {
    case 0: return 'yellow'; // Waiting for Payment
    case 1: return 'green';  // Payment Confirmed
    case 2: return 'red';    // Cancelled
    case 3: return 'blue';   // Request Refund
    case 4: return 'orange'; // Done
    default: return 'gray';
  }
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0: return 'Waiting for Payment';
    case 1: return 'Payment Confirmed';
    case 2: return 'Cancelled';
    case 3: return 'Request Refund';
    case 4: return 'Done';
    default: return 'Unknown';
  }
};
</script>

<template>
  <div class="p-6 mt-16">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">All Bookings</h1>
      <VButton v-if="isCustomer()" variant="primary" @click="goToAdd">Add Booking</VButton>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by property, room, or booking ID..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col">
        <label class="mb-2 text-sm font-medium text-gray-700">Filter by Status</label>
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="status in statusOptions"
            :key="status.value"
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-gray-600">Loading bookings...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div v-if="!loading && filteredRows.length === 0" class="text-gray-500">
      No bookings found matching your criteria.
    </div>

    <div v-if="filteredRows.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="b in filteredRows"
            :key="b.bookingID"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ b.bookingID }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ b.propertyName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ b.roomName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(b.checkInDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(b.checkOutDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {{ b.totalPrice.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <VBookingsChip :color="getStatusColor(b.status)">
                    {{ getStatusLabel(b.status) }}
                </VBookingsChip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <VButton variant="info" size="sm" @click="goToDetail(b.bookingID)">Detail</VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

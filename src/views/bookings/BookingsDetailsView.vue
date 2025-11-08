<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';
import { toast } from 'vue-sonner';
import { storeToRefs } from 'pinia';

import VButton from '@/components/common/VButton.vue';
import VBookingsChip from '@/components/common/VBookingsChip.vue';
import VConfirmModal from '@/components/common/VConfirmModal.vue';

import type { AccommodationBookingResponseDTO } from '@/interfaces/response/booking.interface.ts';
import { useBookingStore } from '@/stores/booking.store';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();
const { loading, error } = storeToRefs(bookingStore);

const booking = ref<AccommodationBookingResponseDTO | null>(null);
const showCancelModal = ref(false);
const bookingToCancel = ref<string | null>(null);

const showPayModal = ref(false);
const bookingToPay = ref<string | null>(null);


const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return '-';
  return format(parsed, 'dd MMM yyyy, HH:mm:ss');
};


onMounted(async () => {
  try {
    const bookingID = route.params.bookingID as string;
    booking.value = await bookingStore.fetchBookingById(bookingID);
  } catch (err) {
    console.error('Error fetching booking:', err);
  }
});

const handlePay = (id: string) => {
  bookingToPay.value = id;
  showPayModal.value = true;
};

const confirmPay = async () => {
    if (!bookingToPay.value) return;

    await bookingStore.payBooking(bookingToPay.value);
    booking.value = await bookingStore.fetchBookingById(bookingToPay.value);

    showPayModal.value = false;
    bookingToPay.value = null;
  
};


const handleUpdate = (id: string) => {
  router.push({
    path: `/bookings/update/${id}`,
    state: { booking: booking.value }
  });
};


const handleRefund = async (id: string) => {
  
    await bookingStore.refundBooking(id);
    booking.value = await bookingStore.fetchBookingById(id); // refresh

};

const confirmCancel = async () => {
    if (!bookingToCancel.value) return;
    await bookingStore.cancelBooking(bookingToCancel.value);
    router.push('/bookings');
    showCancelModal.value = false;
    bookingToCancel.value = null;
};

const handleCancel = (id: string) => {
  bookingToCancel.value = id;
  showCancelModal.value = true;
};

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
  <div class="p-6 max-w-5xl mx-auto mt-12">
    <div v-if="loading" class="text-center text-gray-600">Loading booking details...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="booking" class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
            <h1 class="text-3xl font-bold mb-2">
                Booking Details: {{ booking.bookingID }}
            </h1>
            <VBookingsChip :color="getStatusColor(booking.status)">
            {{ getStatusLabel(booking.status) }}
            </VBookingsChip>
        </div>

        <!-- Conditional Action Buttons -->
        <div class="flex flex-wrap gap-3 justify-end">
          <!-- Waiting for Payment -->
          <template v-if="booking.status === 0">
            <VButton variant="primary" @click="handlePay(booking.bookingID)">Pay</VButton>
            <VButton
              v-if="booking.extraPay === 0"
              variant="warning"
              @click="handleUpdate(booking.bookingID)"
            >
              Update
            </VButton>
            <VButton variant="danger" @click="handleCancel(booking.bookingID)">Cancel</VButton>
          </template>

          <!-- Payment Confirmed -->
          <template v-else-if="booking.status === 1">
            <VButton variant="warning" @click="handleUpdate(booking.bookingID)">Update</VButton>
            <VButton variant="danger" @click="handleCancel(booking.bookingID)">Cancel</VButton>
          </template>

          <!-- Cancelled -->
          <template v-else-if="booking.status === 3">
            <VButton variant="info" @click="handleRefund(booking.bookingID)">Refund</VButton>
            <VButton variant="danger" @click="handleCancel(booking.bookingID)">Cancel</VButton>
          </template>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
        <div>
          <p class="text-sm text-gray-500">Property Name</p>
          <p class="text-base font-medium">{{ booking.propertyName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Room Name</p>
          <p class="text-base font-medium">{{ booking.roomName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Customer Name</p>
          <p class="text-base">{{ booking.customerName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Customer Email</p>
          <p class="text-base">{{ booking.customerEmail }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Customer Phone</p>
          <p class="text-base">{{ booking.customerPhone }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Check-in Date</p>
          <p class="text-base">{{ formatDateTime(booking.checkInDate) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Check-out Date</p>
          <p class="text-base">{{ formatDateTime(booking.checkOutDate) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Total Days</p>
          <p class="text-base">{{ booking.totalDays }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Total Price</p>
          <p class="text-base font-semibold text-green-700">
            Rp{{ booking.totalPrice.toLocaleString() }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Breakfast</p>
          <p class="text-base">{{ booking.breakfast ? 'Included' : 'Not Included' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Capacity</p>
          <p class="text-base">{{ booking.capacity }} persons</p>
        </div>

        <!-- Optional: Show only if > 0 -->
        <div v-if="booking.extraPay > 0">
          <p class="text-sm text-gray-500">Extra Pay</p>
          <p class="text-base">Rp{{ booking.extraPay.toLocaleString() }}</p>
        </div>
        <div v-if="booking.refund > 0">
          <p class="text-sm text-gray-500">Refund</p>
          <p class="text-base">Rp{{ booking.refund.toLocaleString() }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Created Date</p>
          <p class="text-base">{{ formatDateTime(booking.createdDate) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Updated Date</p>
          <p class="text-base">{{ formatDateTime(booking.updatedDate) }}</p>
        </div>
      </div>

      <VButton variant="secondary" @click="router.push('/bookings')">Back</VButton>
    </div>

    <VConfirmModal
        :show="showCancelModal"
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirm-label="Yes, Cancel"
        cancel-label="No"
        :danger="true"
        @confirm="confirmCancel"
        @cancel="showCancelModal = false"
    />
    <VConfirmModal
        :show="showPayModal"
        title="Confirm Payment"
        message="Are you sure you want to pay for this booking?"
        confirm-label="Yes, Pay"
        cancel-label="No"
        @confirm="confirmPay"
        @cancel="showPayModal = false"
    />

  </div>
</template>

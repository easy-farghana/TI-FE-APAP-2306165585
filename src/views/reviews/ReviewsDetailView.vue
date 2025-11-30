<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useReviewStore } from '@/stores/review.store';
import { format } from 'date-fns';

const route = useRoute();
const reviewStore = useReviewStore();
const reviewID = route.params.reviewId as string;
const review = ref<any>(null);
const loading = ref(true);
const error = ref('');

const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy, HH:mm');

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    review.value = await reviewStore.fetchReviewById(reviewID);
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch review';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 mt-16">
    <h1 class="text-2xl font-bold mb-6 text-center">Review Detail</h1>

    <div v-if="loading" class="text-gray-500 text-center">Loading review...</div>
    <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
    <div v-else-if="review" class="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
      <!-- Header -->
      <div class="mb-4">
        <p class="text-lg font-semibold">Customer: {{ review.customerName }}</p>
        <p class="text-gray-600">Property: {{ review.propertyName }}</p>
        <p class="text-gray-500 text-sm">Booking ID: {{ review.bookingID }}</p>
      </div>

      <!-- Comment -->
      <div class="mb-4">
        <p class="font-medium">Comment:</p>
        <p class="mt-1 text-gray-700">{{ review.comment }}</p>
      </div>

      <!-- Ratings -->
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600 font-medium">Cleanliness:</p>
          <p class="text-gray-800">{{ review.cleanlinessRating }}/5</p>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Facilities:</p>
          <p class="text-gray-800">{{ review.facilityRating }}/5</p>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Service:</p>
          <p class="text-gray-800">{{ review.serviceRating }}/5</p>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Value:</p>
          <p class="text-gray-800">{{ review.valueRating }}/5</p>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-gray-600 font-medium">Overall Rating:</p>
        <p class="text-gray-800 text-lg font-semibold">{{ review.overallRating }}/5</p>
      </div>

      <!-- Timestamps -->
      <div class="text-gray-500 text-sm">
        <p>Created At: {{ formatDate(review.createdAt) }}</p>
        <p v-if="review.updatedAt">Updated At: {{ formatDate(review.updatedAt) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: tambahkan hover effect supaya card lebih floating */
.bg-white.shadow-xl:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease-in-out;
}
</style>

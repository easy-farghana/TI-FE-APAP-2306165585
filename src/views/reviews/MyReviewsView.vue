<script setup lang="ts">
import { onMounted } from 'vue';
import { useReviewStore } from '@/stores/review.store';
import VButton from '@/components/common/VButton.vue';
import { format } from 'date-fns';

const reviewStore = useReviewStore();
const { reviews, loading, error } = reviewStore;

onMounted(() => {
  reviewStore.fetchReviewsByCustomer();
});

const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy, HH:mm');
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-16">
    <h1 class="text-2xl font-bold mb-6">My Reviews</h1>

    <div v-if="loading" class="text-gray-500">Loading your reviews...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="reviews.length === 0" class="text-gray-500">You haven't written any reviews yet.</div>

      <div v-for="review in reviews" :key="review.reviewID" class="mb-6 p-4 border rounded-lg">
        <p class="font-semibold">Property: {{ review.propertyName }}</p>
        <p class="mt-1">Customer: {{ review.customerName }}</p>
        <p class="mt-1">{{ review.comment }}</p>
        <p class="mt-1 font-medium">Overall Rating: {{ review.overallRating }}/5</p>
        <VButton
          class="m-4"
          variant="primary"
          size="sm"
          @click="$router.push(`/review/${review.reviewID}`)"
        >
          Details
        </VButton>
      </div>
    </div>
  </div>
</template>

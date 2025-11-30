<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useReviewStore } from '@/stores/review.store';
import { format } from 'date-fns';
import VButton from '@/components/common/VButton.vue';

const route = useRoute();
const reviewStore = useReviewStore();
const { reviews, loading, error } = storeToRefs(reviewStore);

// Ref untuk propertyID
const propertyID = ref(route.params.propertyID as string);

// Watch propertyID, fetch tiap berubah
watch(
  () => route.params.propertyID,
  (newID) => {
    if (newID) {
      propertyID.value = newID as string;
      reviewStore.fetchReviewsByProperty(propertyID.value);
    }
  },
  { immediate: true }
);

// Computed untuk propertyName
const propertyName = computed(() => reviews.value.length ? reviews.value[0]!.propertyName : '');

// Format date helper
const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy, HH:mm');
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-16">
    <h1 class="text-2xl font-bold mb-6">
      Review for Property: {{ propertyName }}
    </h1>

    <div v-if="loading" class="text-gray-500">Loading reviews...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="reviews.length === 0" class="text-gray-500">No reviews yet.</div>

      <div v-for="review in reviews" :key="review.reviewID" class="mb-6 p-4 border rounded-lg">
        <p class="font-semibold">Customer: {{ review.customerName }}</p>
        <p class="mt-1">{{ review.comment }}</p>
        <p class="mt-1 font-medium">Overall Rating: {{ review.overallRating }}/5</p>
        <p class="text-gray-500 text-sm mt-1">Created At: {{ formatDate(review.createdAt) }}</p>
        <VButton
          class="my-4 mx-2"
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

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useReviewStore } from '@/stores/review.store';
import type { ReviewRequest } from '@/interfaces/request/add.review.interface';
import VButton from '@/components/common/VButton.vue';


const reviewStore = useReviewStore();
const route = useRoute();
const router = useRouter();

const bookingID = route.params.bookingID as string;

const comment = ref('');
const cleanlinessRating = ref(1);
const facilityRating = ref(1);
const serviceRating = ref(1);
const valueRating = ref(1);

const submitting = ref(false);


const clampRating = (value: number) => Math.min(5, Math.max(1, value));

const submitReview = async () => {
  if (!bookingID) {
    toast.error('Invalid booking ID');
    return;
  }

  const payload: ReviewRequest = {
    bookingID,
    comment: comment.value,
    cleanlinessRating: clampRating(cleanlinessRating.value),
    facilityRating: clampRating(facilityRating.value),
    serviceRating: clampRating(serviceRating.value),
    valueRating: clampRating(valueRating.value),
  };

  try {
    submitting.value = true;
    await reviewStore.createReview(payload);
    toast.success('Review submitted successfully');
  } catch (err) {
    console.error(err);
    toast.error('Failed to submit review: ' + err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-32">
    <h1 class="text-2xl font-bold mb-6">Write a Review</h1>

    <div class="space-y-4">
      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          v-model="comment"
          rows="4"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Write your review here..."
        ></textarea>
      </div>

      <!-- Ratings -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Cleanliness</label>
          <input
            type="number"
            v-model.number="cleanlinessRating"
            min="1"
            max="5"
            step="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Facilities</label>
          <input
            type="number"
            v-model.number="facilityRating"
            min="1"
            max="5"
            step="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Service</label>
          <input
            type="number"
            v-model.number="serviceRating"
            min="1"
            max="5"
            step="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="number"
            v-model.number="valueRating"
            min="1"
            max="5"
            step="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <VButton
          variant="primary"
          :loading="submitting"
          @click="submitReview"
        >
          Submit Review
        </VButton>
      </div>
    </div>
  </div>
</template>

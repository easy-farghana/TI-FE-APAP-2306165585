
<script setup lang="ts">
import { onMounted } from 'vue';
import { useStatisticsStore } from '@/stores/statistics.store';
import { storeToRefs } from 'pinia';

const statisticsStore = useStatisticsStore();

const { statistics, loading, error } = storeToRefs(statisticsStore);
import { ref } from 'vue';
import { openSSOPopup } from '@/utils/sso'; // Adjust path as needed

const isLoading = ref(false);
const errorMessage = ref('');
const currentUser = ref('');

onMounted(async () => {
  await statisticsStore.fetchStatistics();
  console.log(statistics);
  const apiUrl = import.meta.env.VITE_API_URL
  console.log("Api used: " + apiUrl);
});
const handleConnect = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // This line waits until the popup flow is totally finished
    const payload = await openSSOPopup("http://localhost:5174/sso-popup");

    if (payload.token) {
      // Success!
      localStorage.setItem('token', payload.token);
      currentUser.value = payload.username || 'Unknown';
      alert('Successfully Connected!');
    } else {
      errorMessage.value = "Login failed: No token received.";
    }
  } catch (error: any) {
    // Handles if user closes window or popup is blocked
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800">Welcome to Accommodation App</h1>
      <p class="text-gray-600 mt-2">
        Let's stay with us! Discover, book, and manage your perfect stay effortlessly!
      </p>
    </div>

    <div class="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Platform Statistics
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Total Properties -->
        <div
          class="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-blue-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 10l-9 4-9-4M21 14l-9 4-9-4" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-800">Total Properties</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">
            {{ statistics?.totalProperties ?? 0 }}
          </p>
          <p class="text-sm text-gray-500 mt-1">All registered properties</p>
              <button 
                @click="handleConnect" 
                :disabled="isLoading"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isLoading ? 'Connecting...' : 'Connect with Flight App' }}
              </button>
        </div>

        <!-- Total Bookings -->
        <div
          class="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10m-11 4h12m-12 4h12M5 5h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-gray-800">Total Bookings</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ statistics?.totalBookings ?? 0 }}
          </p>
          <p class="text-sm text-gray-500 mt-1">All recorded bookings</p>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center mt-4 text-gray-500">Loading statistics...</div>
      <div v-if="error" class="text-center mt-4 text-red-500">{{ error }}</div>
    </div>
  </div>
</template>

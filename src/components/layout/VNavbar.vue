<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { openSSOPopup } from '@/utils/sso'
import { ref, watchEffect } from 'vue'
import { removeLocalStorage } from '@/utils/auth';
import { toast } from 'vue-sonner';
import { isAccommodationOwner, isAdmin, isAuthenticated, isCustomer, isPartOfService } from '@/utils/rbac';

if (sessionStorage.getItem("logout_success") === "1") {
  sessionStorage.removeItem("logout_success");
  toast.success("Successfully logged out");
}

if (sessionStorage.getItem("login_success") === "1") {
  sessionStorage.removeItem("login_success");
  toast.success("Successfully connected!");
}

const baseAuthURL = import.meta.env.VITE_AUTH_URL;
const route = useRoute();

const isLoading = ref(false);
const isLoadingLogout = ref(false);

const errorMessage = ref('');

// Load persistent values from localStorage
const currentUser = ref(localStorage.getItem('username'));
const currentToken = ref(localStorage.getItem('token'));
const currentRole = ref(localStorage.getItem('role'));


// Keep localStorage synced with reactive state
watchEffect(() => {
  if (currentUser.value) {
    localStorage.setItem('username', currentUser.value);
  }
  if (currentToken.value) {
    localStorage.setItem('token', currentToken.value);
  }
  if (currentRole.value) {
    localStorage.setItem('role', currentRole.value);
  }
});

const handleConnect = async () => {
  isLoading.value = true;
  errorMessage.value = '';


  try {
    const payload = await openSSOPopup();
    if (payload.token) {
      // Save to reactive state (auto-syncs to localStorage)
      currentToken.value = payload.token;
      currentUser.value = payload.username || 'Unknown User';
      currentRole.value = payload.role || 'Unknown Role';
      sessionStorage.setItem("login_success", "1");
      window.location.reload();
    } 

    if (!isAuthenticated()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = baseAuthURL + "/login";
    }

  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  isLoadingLogout.value = true;

  currentToken.value = null;
  currentUser.value = null;
  currentRole.value = null;

  removeLocalStorage('token');
  removeLocalStorage('username');
  removeLocalStorage('role');

  sessionStorage.setItem("logout_success", "1");

  // Refresh and go back to the home page to reload 
  window.location.href = '/';
};


const getLinkClass = (path: string) =>
  route.path === path
    ? 'text-blue-600'
    : 'text-black hover:text-blue-600'
</script>


<template>
  <header
    class="fixed top-0 flex items-center justify-between w-full px-6 py-4 bg-white shadow-md"
  >
    <!-- Left side: Logo -->
    <RouterLink to="/" class="text-xl font-bold text-blue-600">
      TravelAPAP
    </RouterLink>

    <!-- Right side: Navigation -->
    <nav class="flex gap-6">
      <RouterLink v-if="isAdmin() || isAccommodationOwner() || isCustomer()" to="/property" :class="getLinkClass('/property')">Property</RouterLink>
      <RouterLink v-if="isAdmin() || isAccommodationOwner() || isCustomer()" to="/bookings" :class="getLinkClass('/bookings')">Bookings</RouterLink>
      <RouterLink v-if="isAdmin() || isAccommodationOwner()" to="/bookings/chart" :class="getLinkClass('/bookings/chart')">Statistic</RouterLink>
      <RouterLink v-if="isPartOfService()" to="/bills/service" :class="getLinkClass('/bills')">Service Bills</RouterLink>
      <RouterLink v-if="isCustomer()"to="/bills/customer" :class="getLinkClass('/bills')">My Bills</RouterLink>
      <RouterLink v-if="isCustomer()"to="/review/my-reviews" :class="getLinkClass('/bills')">My Reviews</RouterLink>
      <RouterLink v-if="isAdmin()"to="/bills" :class="getLinkClass('/bills')">Bills</RouterLink>


      <button 
        v-if="!currentUser"
        @click="handleConnect" 
        :disabled="isLoading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isLoading ? 'Connecting...' : 'Connect with Flight App' }}
      </button>
      <p 
        v-if="currentUser"
        class="font-bold px-16 text-blue-600 my-0">
          {{ currentUser }} 
      </p>
      <button 
        v-if="currentUser"
        @click="handleLogout" 
        :disabled="isLoading"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {{ isLoadingLogout ? 'Logging out...' : 'Logout' }}
      </button>
    </nav>
  </header>
</template>

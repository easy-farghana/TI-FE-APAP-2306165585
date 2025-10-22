<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

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
      <RouterLink to="/" :class="getLinkClass('/')">Home</RouterLink>
      <!-- Add more links here -->
      <RouterLink to="/about" :class="getLinkClass('/about')">About</RouterLink>
    </nav>
  </header>
</template>

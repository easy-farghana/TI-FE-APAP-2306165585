import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertyView from '@/views/property/PropertyView.vue'
import PropertyDetailsView from '@/views/property/PropertyDetailsView.vue'
import CreatePropertyView from '@/views/property/CreatePropertyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/property',
      name: 'property',
      component: PropertyView,
    },
    {
      path: '/property/:id',
      name: 'property-detail',
      component: PropertyDetailsView,
    },
    {
      path: '/property/create',
      name: 'create-property',
      component: CreatePropertyView,
    },
  ],
})

export default router

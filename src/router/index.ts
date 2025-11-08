import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertyView from '@/views/property/PropertyView.vue'
import PropertyDetailsView from '@/views/property/PropertyDetailsView.vue'
import CreatePropertyView from '@/views/property/CreatePropertyView.vue'
import AddRoomTypeView from '@/views/property/AddRoomTypeView.vue'
import UpdatePropertyView from '@/views/property/UpdatePropertyView.vue'
import BookingsView from '@/views/bookings/BookingsView.vue'
import BookingsDetailsView from '@/views/bookings/BookingsDetailsView.vue'
import CreateBookingsView from '@/views/bookings/BookingsFormView.vue'
import BookFromPropertyView from '@/views/bookings/BookFromPropertyView.vue'
import IncomeStatisticsView from '@/views/statistics/IncomeStatisticsView.vue'

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
    {
      path: '/property/update/:propertyId',
      name: 'update-property',
      component: UpdatePropertyView,
    },
    {
      path: '/property/updateroom/:propertyId',
      name: 'add-room-type',
      component: AddRoomTypeView,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingsView,
    },
    {
      path: '/bookings/:bookingID',
      name: 'bookings-details',
      component: BookingsDetailsView,
    },
    {
      path: '/bookings/create',
      name: 'bookings-create',
      component: CreateBookingsView,
    },
    {
      path: '/bookings/update/:bookingID',
      name: 'bookings-update',
      component: CreateBookingsView,
    },
    {
      path: '/booking/add/:roomID/:roomName/:roomTypeID/:capacity',
      name: 'bookings-create-a',
      component: BookFromPropertyView,
    },
    {
      path: '/chart',
      name: 'income-statistics',
      component: IncomeStatisticsView,
    },
  ],
})

export default router

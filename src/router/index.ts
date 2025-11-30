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
import { toast } from 'vue-sonner'
import { isAccommodationOwner, isAdmin, isAuthenticated, isCustomer } from '@/utils/rbac'
import BillView from '@/views/bills/BillView.vue'
import BillDetailsView from '@/views/bills/BillDetailsView.vue'

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
      path: '/booking/add/:propertyID/:roomID/:roomName/:roomTypeID/:capacity',
      name: 'bookings-create-a',
      component: BookFromPropertyView,
    },
    {
      path: '/bookings/chart',
      name: 'income-statistics',
      component: IncomeStatisticsView,
    },
    {
      path: '/bills',
      name: 'bills',
      component: BillView,
    },
    {
      path: '/bills/customer',
      name: 'bills-customer',
      component: BillView,
    },
    {
      path: '/bills/service',
      name: 'bills-service',
      component: BillView,
    },
    {
      path: '/bill/:billId',
      name: 'bills-details',
      component: BillDetailsView,
    },
    
  ],
})
const routeRoles: Record<string, () => boolean> = {
  '/bills/customer': isCustomer,
  '/bills/service': isAdmin,
  '/bills': isAdmin,
  '/bill': () => isAdmin() || isCustomer(), 
  '/statistics': isAdmin,
  '/booking': () => isAdmin() || isCustomer() || isAccommodationOwner(),
};

// Navigation guard for RBAC
router.beforeEach((to, _, next) => {
  const auth = isAuthenticated();

  // Redirect unauthenticated
  if (!auth && !['/', '/login', '/register'].includes(to.path)) {
    toast.error('Token expired, please log in with Flight App');
    return next('/');
  }

  // Find matching route
  const match = Object.keys(routeRoles).find(path => to.path.startsWith(path));

  if (match && routeRoles[match]) {
    if (!routeRoles[match]()) {
      toast.error('You do not have permission to access this page');
      return next('/');
    }
}

  next();
});


export default router

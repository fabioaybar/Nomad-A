import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/core/HomePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterPage.vue'),
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/vehicle/VehicleListPage.vue'),
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle-detail',
      component: () => import('../views/vehicle/VehicleDetailPage.vue'),
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/vehicle/LeaderboardPage.vue'),
    },
    {
      path: '/my-rentals',
      name: 'my-rentals',
      component: () => import('../views/booking/MyRentalsPage.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user?.role === 'vendor') {
          next('/vendor')
        } else if (authStore.user?.role === 'admin') {
          next('/admin')
        } else {
          next()
        }
      }
    },
    {
      path: '/rentals/:id',
      name: 'rental-details',
      component: () => import('../views/booking/RentalDetailsPage.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user?.role === 'vendor') {
          next('/vendor')
        } else if (authStore.user?.role === 'admin') {
          next('/admin')
        } else {
          next()
        }
      }
    },
    {
      path: '/booking/:vehicleId',
      name: 'booking',
      component: () => import('../views/booking/BookingPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/user/DashboardPage.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user?.role === 'vendor') {
          next('/vendor')
        } else if (authStore.user?.role === 'admin') {
          next('/admin')
        } else {
          next()
        }
      }
    },
    {
      path: '/vendor/onboard',
      name: 'vendor-onboarding',
      component: () => import('../views/vendor/VendorOnboardingPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/vendor',
      component: () => import('../views/vendor/VendorDashboard.vue'),
      meta: { requiresAuth: true, requiresRole: 'vendor' },
      children: [
        {
          path: '',
          name: 'vendor-dashboard',
          component: () => import('../views/vendor/dashboard/VendorDashboard.vue'),
        },
        {
          path: 'vehicles',
          name: 'vendor-vehicles',
          component: () => import('../views/vendor/dashboard/VehicleManagement.vue'),
        },
        {
          path: 'vehicles/new',
          name: 'vendor-vehicle-new',
          component: () => import('../views/vendor/VehicleFormPage.vue'),
        },
        {
          path: 'vehicles/:id/edit',
          name: 'vendor-vehicle-edit',
          component: () => import('../views/vendor/VehicleFormPage.vue'),
        },
        {
          path: 'bookings',
          name: 'vendor-bookings',
          component: () => import('../views/vendor/dashboard/BookingManagement.vue'),
        },
        {
          path: 'maintenance',
          name: 'vendor-maintenance',
          component: () => import('../views/vendor/dashboard/MaintenanceManagement.vue'),
        },
        {
          path: 'finances',
          name: 'vendor-finances',
          component: () => import('../views/vendor/dashboard/FinancialManagement.vue'),
        },
        {
          path: 'settings',
          name: 'vendor-settings',
          component: () => import('../views/vendor/dashboard/VendorSettings.vue'),
        },
        {
          path: 'analytics',
          name: 'vendor-analytics',
          component: () => import('../views/vendor/dashboard/PerformanceOverview.vue'),
        },
        {
          path: 'feedback',
          name: 'vendor-feedback',
          component: () => import('../views/vendor/dashboard/FeedbackManagement.vue'),
        },
        {
          path: 'calendar',
          name: 'vendor-calendar',
          component: () => import('../views/vendor/dashboard/CalendarIntegration.vue'),
        },
        {
          path: 'communication',
          name: 'vendor-communication',
          component: () => import('../views/vendor/dashboard/CustomerCommunication.vue'),
        },
      ],
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/users/UserManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/users/:id',
      name: 'admin-user-profile',
      component: () => import('../views/admin/users/UserProfile.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/vendors',
      name: 'admin-vendors',
      component: () => import('../views/admin/vendors/VendorManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/vendors/:id',
      name: 'admin-vendor-profile',
      component: () => import('../views/admin/vendors/VendorProfile.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/vehicles',
      name: 'admin-vehicles',
      component: () => import('../views/admin/vehicles/VehicleManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('../views/admin/bookings/BookingManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/reviews',
      name: 'admin-reviews',
      component: () => import('../views/admin/reviews/ReviewManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/financial',
      name: 'admin-financial',
      component: () => import('../views/admin/financial/FinancialManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/analytics',
      name: 'admin-analytics',
      component: () => import('../views/admin/analytics/SystemAnalytics.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/content',
      name: 'admin-content',
      component: () => import('../views/admin/content/ContentManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../views/admin/settings/SystemSettings.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/support',
      name: 'admin-support',
      component: () => import('../views/admin/support/SupportManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/admin/rewards',
      name: 'admin-rewards',
      component: () => import('../views/admin/rewards/RewardsManagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reviews',
      name: 'my-reviews',
      component: () => import('../views/user/MyReviewsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rentals/:id/review',
      name: 'write-review',
      component: () => import('../views/user/WriteReviewPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: () => import('../views/user/RewardsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/user/NotificationsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/communication/ChatPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mobile',
      name: 'mobile-scaffold',
      component: () => import('../views/core/MobileAppScaffold.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/status',
      name: 'status',
      component: () => import('../views/booking/StatusPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/core/PrivacyPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/core/TermsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/core/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // 🚧 MODO DESARROLLO:
  // Estamos desactivando las validaciones de login y roles
  // solo para poder probar /vendor/vehicles y la integración con /api/autos.
  next()
})


export default router
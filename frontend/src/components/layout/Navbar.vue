<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <RouterLink :to="logoLink" class="flex items-center" aria-label="Nomad A Home">
            <span class="text-2xl font-semibold tracking-tight text-gray-900 flex items-center leading-none select-none dark:text-gray-100">
              <span>Nomad</span>
              <img :src="rafLogo" alt="A" class="inline-block h-6 w-auto -ml-0.5 align-baseline translate-y-[2px]" />
            </span>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <template v-if="authStore.isVendor">
            <!-- Vendor Navigation (localized labels) -->
            <RouterLink to="/vendor/vehicles" class="nav-link">{{ t('vendor.vehicles.title') }}</RouterLink>
            <RouterLink to="/vendor/bookings" class="nav-link">{{ t('vendor.bookings.title') }}</RouterLink>
            <RouterLink to="/vendor/maintenance" class="nav-link">{{ t('vendor.maintenance.title') }}</RouterLink>
            <RouterLink to="/vendor/finances" class="nav-link">{{ t('vendor.finances.title') }}</RouterLink>
          </template>
          
          <template v-else-if="authStore.isAdmin">
            <!-- Admin Navigation (localized labels) -->
            <RouterLink to="/admin/users" class="nav-link">{{ t('admin.manage_users.title') }}</RouterLink>
            <RouterLink to="/admin/vehicles" class="nav-link">{{ t('admin.manage_vehicles.title') }}</RouterLink>
            <RouterLink to="/admin/bookings" class="nav-link">{{ t('admin.view_bookings.title') }}</RouterLink>
            <RouterLink to="/status" class="nav-link">{{ t('admin.system_status') }}</RouterLink>
          </template>
          <template v-else>
            <!-- Regular User Navigation -->
            <RouterLink to="/vehicles" class="nav-link">{{ t('nav.browse_cars') }}</RouterLink>
            <RouterLink v-if="authStore.isAuthenticated" to="/my-rentals" class="nav-link">{{ t('nav.my_rentals') }}</RouterLink>
          </template>
          
          <!-- TEMP FEATURE FLAG: External APIs Toggle (remove when not needed) -->
          <label class="flex items-center space-x-2 text-sm text-gray-600 select-none">
            <input type="checkbox" v-model="settings.externalApisEnabled" class="toggle-checkbox">
            <span>APIs</span>
          </label>

          
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- Location Display -->
          <div class="hidden sm:flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
            <MapPin class="w-4 h-4 mr-1" />
            <span>Chile</span>
          </div>

          <!-- Currency Selector -->
          <div class="hidden md:block">
            <CurrencySelector />
          </div>
          
          <!-- Notification Bell -->
          <div v-if="authStore.isAuthenticated" class="notification-dropdown">
            <NotificationBell />
          </div>
          
          <!-- Auth Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User class="w-4 h-4 text-primary-600" />
                </div>
                <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">{{ authStore.user?.name }}</span>
                <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </MenuButton>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none dark:bg-gray-800 dark:border-gray-700">
                  <div class="py-1">
                    <MenuItem v-if="!authStore.isVendor && !authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/dashboard"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <LayoutDashboard class="w-4 h-4 mr-2" />
                          {{ t('nav.dashboard') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-if="authStore.isVendor" v-slot="{ active }">
                      <RouterLink
                        to="/vendor"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Building2 class="w-4 h-4 mr-2" />
                          {{ t('nav.vendor_dashboard') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isVendor" v-slot="{ active }">
                      <RouterLink
                        to="/vendor/analytics"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <TrendingUp class="w-4 h-4 mr-2" />
                          {{ t('vendor.analytics.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isVendor" v-slot="{ active }">
                      <RouterLink
                        to="/vendor/feedback"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <MessageCircle class="w-4 h-4 mr-2" />
                          {{ t('vendor.feedback.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isVendor" v-slot="{ active }">
                      <RouterLink
                        to="/vendor/calendar"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <CalendarDays class="w-4 h-4 mr-2" />
                          {{ t('vendor.calendar.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isVendor" v-slot="{ active }">
                      <RouterLink
                        to="/vendor/settings"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Settings class="w-4 h-4 mr-2" />
                          {{ t('vendor.settings.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Shield class="w-4 h-4 mr-2" />
                          {{ t('admin.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin/users"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Users class="w-4 h-4 mr-2" />
                          {{ t('admin.manage_users.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin/vehicles"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Car class="w-4 h-4 mr-2" />
                          {{ t('admin.manage_vehicles.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin/bookings"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Calendar class="w-4 h-4 mr-2" />
                          {{ t('admin.view_bookings.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin/support"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <MessageCircle class="w-4 h-4 mr-2" />
                          {{ t('admin.support_tickets.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/admin/rewards"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Star class="w-4 h-4 mr-2" />
                          {{ t('admin.rewards.title') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <div class="border-t border-gray-100 my-1"></div>
                    
                    <MenuItem v-if="!authStore.isVendor && !authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/reviews"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Star class="w-4 h-4 mr-2" />
                          {{ t('nav.my_reviews') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-if="!authStore.isVendor && !authStore.isAdmin" v-slot="{ active }">
                      <RouterLink
                        to="/rewards"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Gift class="w-4 h-4 mr-2" />
                          {{ t('nav.rewards') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-slot="{ active }">
                      <RouterLink
                        to="/notifications"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Bell class="w-4 h-4 mr-2" />
                          {{ t('nav.notifications') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-slot="{ active }">
                      <RouterLink
                        to="/profile"
                        :class="['block px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <Settings class="w-4 h-4 mr-2" />
                          {{ t('nav.profile_settings') }}
                        </div>
                      </RouterLink>
                    </MenuItem>
                    
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="['block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200', active ? 'bg-gray-50 dark:bg-gray-700' : '']"
                      >
                        <div class="flex items-center">
                          <LogOut class="w-4 h-4 mr-2" />
                          {{ t('nav.sign_out') }}
                        </div>
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          
          <!-- Guest Menu -->
          <div v-else class="flex items-center space-x-2 md:space-x-3">
            <RouterLink to="/login" class="btn-secondary text-xs px-3 py-2 md:text-sm md:px-4 md:py-2">{{ t('nav.sign_in') }}</RouterLink>
            <RouterLink to="/register" class="btn-primary hidden sm:inline-flex">{{ t('nav.get_started') }}</RouterLink>
          </div>

          <!-- APIs toggle moved into mobile menu -->

          

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700 ml-1"
          >
            <MenuIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div class="px-4 py-3 space-y-3">
        <!-- Primary action up top (spans both columns to match combined width) -->
        <div class="grid grid-cols-2 gap-2">
          <RouterLink to="/register" class="btn-primary col-span-2 text-base justify-center text-center">{{ t('nav.get_started') }}</RouterLink>
          <!-- Main navigation in one row -->
          <RouterLink to="/vehicles" class="btn-secondary text-center">{{ t('nav.browse_cars') }}</RouterLink>
        </div>

        <RouterLink v-if="authStore.isAuthenticated" to="/my-rentals" class="mobile-nav-link">{{ t('nav.my_rentals') }}</RouterLink>

        <!-- Preferences row: Currency + APIs -->
        <div class="pt-4 mt-1 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <CurrencySelector />
            </div>
            <label class="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">
              <span>APIs</span>
              <input type="checkbox" v-model="settings.externalApisEnabled" class="toggle-checkbox">
            </label>
          </div>
        </div>

        <!-- Removed duplicate sign-in link in mobile menu for a cleaner layout -->
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  User, MapPin, ChevronDown, LayoutDashboard, 
  Building2, Shield, Settings, LogOut, Menu as MenuIcon,
  TrendingUp, MessageCircle, CalendarDays, Users, Car, Calendar, Star, Gift
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useSettingsStore } from '../../stores/settings'
import { useTranslation } from '../../services/i18n'
import CurrencySelector from '../ui/CurrencySelector.vue'
import NotificationBell from '../ui/NotificationBell.vue'
// Use URL resolution to avoid type issues with static assets
const rafLogo = new URL('./raf.png', import.meta.url).href

const router = useRouter()
const authStore = useAuthStore()
const settings = useSettingsStore()
const { t } = useTranslation()

const mobileMenuOpen = ref(false)

// Computed property for logo link based on user role
const logoLink = computed(() => {
  if (authStore.isAdmin) {
    return '/admin'
  } else if (authStore.isVendor) {
    return '/vendor'
  } else {
    return '/'
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

</script>


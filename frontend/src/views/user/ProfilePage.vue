<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('profile.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('profile.subtitle') }}</p>
      </div>

      <!-- Profile Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <form @submit.prevent="updateProfile" class="space-y-6">
          <!-- Profile Image -->
          <div class="text-center">
            <div class="relative inline-block">
              <div v-if="profile.profile_image" class="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                <img
                  :src="profile.profile_image"
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center">
                <User class="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <button
                type="button"
                @click="handleFileClick"
                class="absolute bottom-0 right-0 bg-primary-600 dark:bg-primary-500 text-white p-2 rounded-full hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />
          </div>

          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.fullName') }}
              </label>
              <input
                v-model="profile.name"
                type="text"
                required
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.email') }}
              </label>
              <input
                v-model="profile.email"
                type="email"
                required
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('profile.emailHint') }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.phone') }}
              </label>
              <input
                v-model="profile.phone"
                type="tel"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.role') }}
              </label>
              <input
                :value="profile.role"
                type="text"
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 capitalize"
              />
            </div>
          </div>



          <!-- Location -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.address') }}
              </label>
              <input
                v-model="profile.address"
                type="text"
                :placeholder="t('profile.addressPlaceholder')"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.city') }}
              </label>
              <input
                v-model="profile.city"
                type="text"
                :placeholder="t('profile.cityPlaceholder')"
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {{ t('profile.reset') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-8 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {{ submitting ? t('profile.updating') : t('profile.updateProfile') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ t('profile.changePassword') }}</h2>
        <form @submit.prevent="changePassword" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.currentPassword') }}
              </label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                required
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('profile.newPassword') }}
              </label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                required
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('profile.confirmPassword') }}
            </label>
            <input
              v-model="passwordForm.new_password_confirmation"
              type="password"
              required
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="changingPassword"
              class="px-8 py-2 bg-secondary-600 dark:bg-secondary-500 text-white rounded-md hover:bg-secondary-700 dark:hover:bg-secondary-600 disabled:opacity-50 transition-colors"
            >
              {{ changingPassword ? t('profile.changing') : t('profile.changePasswordButton') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Camera, User } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useTranslation } from '../../services/i18n'

// Types
interface Profile {
  name: string
  email: string
  phone: string
  role: string
  address: string
  city: string
  profile_image: string | null
}

interface PasswordForm {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

// Template refs
const fileInput = ref<HTMLInputElement | null>(null)

// Reactive data
const profile = ref<Profile>({
  name: '',
  email: '',
  phone: '',
  role: '',
  address: '',
  city: '',
  profile_image: null
})

const passwordForm = ref<PasswordForm>({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const submitting = ref(false)
const changingPassword = ref(false)
const originalProfile = ref<Profile | null>(null)
const { t } = useTranslation()

/**
 * Fetch user profile
 */
async function fetchProfile() {
  try {
    const response = await api.get('/auth/profile')
    // Handle new Node.js backend response structure
    profile.value = response.data.data?.user || response.data || null
    originalProfile.value = { ...profile.value }
  } catch (error) {
    console.error('Error fetching profile:', error)
    // For demo purposes, show sample data
    profile.value = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'user',
      address: '123 Main St',
      city: 'New York',
      profile_image: null
    }
    originalProfile.value = { ...profile.value }
  }
}

/**
 * Update profile
 */
async function updateProfile() {
  try {
    submitting.value = true
    const response = await api.put('/auth/profile', profile.value)
    
    // Update original profile
    originalProfile.value = { ...profile.value }
    
    alert(t('profile.updateSuccess'))
  } catch (error) {
    console.error('Error updating profile:', error)
    alert(t('profile.updateError'))
  } finally {
    submitting.value = false
  }
}

/**
 * Change password
 */
async function changePassword() {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    alert(t('profile.passwordMismatch'))
    return
  }

  try {
    changingPassword.value = true
    await api.put('/auth/password', passwordForm.value)
    
    // Reset password form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
    
    alert(t('profile.passwordSuccess'))
  } catch (error) {
    console.error('Error changing password:', error)
    alert(t('profile.passwordError'))
  } finally {
    changingPassword.value = false
  }
}

/**
 * Handle file input click
 */
function handleFileClick() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

/**
 * Handle image upload
 */
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // In a real app, you would upload the file to the server
    // For now, we'll just create a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.profile_image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

/**
 * Reset form to original values
 */
function resetForm() {
  if (originalProfile.value) {
    profile.value = { ...originalProfile.value }
  }
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>

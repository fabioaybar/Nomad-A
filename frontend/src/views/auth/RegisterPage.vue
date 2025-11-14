<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
          <img src="/src/components/layout/raf.png" alt="NomadA" class="w-full h-full object-contain p-2" />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {{ t('auth.create_account') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        {{ t('auth.already_have_account') }}
        <RouterLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          {{ t('auth.sign_in_here') }}
        </RouterLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-200">
              {{ t('auth.i_want_to') }}
            </label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <input
                  id="role-user"
                  v-model="form.role"
                  type="radio"
                  value="user"
                  class="sr-only"
                />
                <label
                  for="role-user"
                  class="role-option"
                  :class="{ 'role-option-selected': form.role === 'user' }"
                >
                  <User class="w-5 h-5" />
                  <span>{{ t('auth.rent_cars') }}</span>
                </label>
              </div>
              <div>
                <input
                  id="role-vendor"
                  v-model="form.role"
                  type="radio"
                  value="vendor"
                  class="sr-only"
                />
                <label
                  for="role-vendor"
                  class="role-option"
                  :class="{ 'role-option-selected': form.role === 'vendor' }"
                >
                  <Building2 class="w-5 h-5" />
                  <span>{{ t('auth.register_vehicle') }}</span>
                </label>
              </div>
            </div>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role[0] }}</p>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('auth.full_name') }}
            </label>
            <div class="mt-1 relative">
              <User class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :placeholder="t('auth.enter_full_name')"
                class="input-field pl-10"
                :class="{ 'border-red-500': errors.name }"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('auth.email_address') }}
            </label>
            <div class="mt-1 relative">
              <Mail class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :placeholder="t('auth.enter_email')"
                class="input-field pl-10"
                :class="{ 'border-red-500': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('auth.password') }}
            </label>
            <div class="mt-1 relative">
              <Lock class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :placeholder="t('auth.create_password')"
                class="input-field pl-10 pr-10"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('auth.confirm_password') }}
            </label>
            <div class="mt-1 relative">
              <Lock class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                :placeholder="t('auth.confirm_password_placeholder')"
                class="input-field pl-10 pr-10"
                :class="{ 'border-red-500': errors.password_confirmation }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation[0] }}</p>
          </div>

          <!-- Phone (Optional) -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('auth.phone_optional') }}
            </label>
            <div class="mt-1 relative">
              <Phone class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                :placeholder="t('auth.enter_phone')"
                class="input-field pl-10"
              />
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.agreeToTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-700 dark:text-gray-300">
                {{ t('auth.agree_terms') }}
                <RouterLink to="/terms" class="text-primary-600 hover:text-primary-500">{{ t('auth.terms_of_service') }}</RouterLink>
                {{ t('auth.and') }}
                <RouterLink to="/privacy" class="text-primary-600 hover:text-primary-500">{{ t('auth.privacy_policy') }}</RouterLink>
              </label>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.agreeToTerms"
            class="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <div v-if="loading" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <UserPlus v-else class="w-4 h-4" />
            <span>{{ loading ? t('auth.creating_account') : t('auth.create_account_button') }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Car, User, Building2, Mail, Lock, Phone, Eye, EyeOff, UserPlus } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useTranslation } from '../../services/i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useTranslation()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user' as 'user' | 'vendor',
  phone: '',
  agreeToTerms: false,
})

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref<Record<string, string[]>>({})

const handleRegister = async () => {
  try {
    loading.value = true
    errors.value = {}
    
    const result = await authStore.register(form.value)
    
    if (result.success) {
      // Redirect based on user role
      if (form.value.role === 'vendor') {
        router.push('/vendor/onboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      // Handle validation errors
      if (result.error && typeof result.error === 'object') {
        errors.value = result.error
      }
    }
  } catch (error: any) {
    console.error('Registration error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="postcss">
.role-option {
  @apply flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors dark:border-gray-700 dark:hover:border-primary-400;
}

.role-option-selected {
  @apply border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300;
}
</style>
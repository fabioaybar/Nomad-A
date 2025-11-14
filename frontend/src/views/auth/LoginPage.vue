<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
          <img src="/src/components/layout/raf.png" alt="NomadA" class="w-full h-full object-contain p-2" />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {{ t('auth.welcome_back') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        {{ t('auth.dont_have_account') }}
        <RouterLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          {{ t('auth.sign_up_free') }}
        </RouterLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
                :placeholder="t('auth.enter_password')"
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

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ t('auth.remember_me') }}
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                {{ t('auth.forgot_password') }}
              </a>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <div v-if="loading" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <LogIn v-else class="w-4 h-4" />
            <span>{{ loading ? t('auth.signing_in') : t('auth.sign_in') }}</span>
          </button>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300">{{ t('auth.quick_demo_access') }}</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <button
              @click="demoLogin('user')"
              class="btn-secondary text-xs py-2 px-3"
              :disabled="loading"
            >
              {{ t('auth.demo_user') }}
            </button>
            <button
              @click="demoLogin('vendor')"
              class="btn-secondary text-xs py-2 px-3"
              :disabled="loading"
            >
              {{ t('auth.demo_vendor') }}
            </button>
            <button
              @click="demoLogin('admin')"
              class="btn-secondary text-xs py-2 px-3"
              :disabled="loading"
            >
              {{ t('auth.demo_admin') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Car, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useTranslation } from '../../services/i18n'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useTranslation()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const loading = ref(false)
const showPassword = ref(false)
const errors = ref<Record<string, string[]>>({})

const handleLogin = async () => {
  try {
    loading.value = true
    errors.value = {}
    
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })
    
    if (result.success) {
      const redirectTo = route.query.redirect as string || '/dashboard'
      router.push(redirectTo)
    } else {
      // Handle validation errors
      if (result.error && typeof result.error === 'object') {
        errors.value = result.error
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const demoLogin = async (role: 'user' | 'vendor' | 'admin') => {
  const credentials = {
    user: { email: 'user@example.com', password: 'password' },
    vendor: { email: 'vendor@example.com', password: 'password' },
    admin: { email: 'admin@carrental.com', password: 'password' },
  }
  
  form.value.email = credentials[role].email
  form.value.password = credentials[role].password
  
  await handleLogin()
}
</script>
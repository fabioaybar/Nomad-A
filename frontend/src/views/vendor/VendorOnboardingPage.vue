<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ t('vendor.onboarding.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t('vendor.onboarding.subtitle') }}
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="step.key"
            class="flex items-center"
            :class="{ 'flex-1': index < steps.length - 1 }"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                :class="getStepClasses(index)"
              >
                <Check v-if="index < currentStep" class="w-4 h-4" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                class="ml-2 text-sm font-medium"
                :class="index <= currentStep ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'"
              >
                {{ step.title }}
              </span>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 h-0.5 mx-4"
              :class="index < currentStep ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <!-- Step 1: Business Information -->
        <div v-if="currentStep === 0" class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ t('vendor.onboarding.business_info.title') }}
          </h2>
          
          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Company Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.business_info.company_name') }} *
                </label>
                <input
                  v-model="form.company_name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.business_info.company_name_placeholder')"
                />
                <p v-if="errors.company_name" class="text-sm text-red-600 mt-1">{{ errors.company_name }}</p>
              </div>

              <!-- Business Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.business_info.business_type') }} *
                </label>
                <select
                  v-model="form.business_type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                >
                  <option value="">{{ t('vendor.onboarding.business_info.select_business_type') }}</option>
                  <option value="individual">{{ t('vendor.onboarding.business_info.individual') }}</option>
                  <option value="company">{{ t('vendor.onboarding.business_info.company') }}</option>
                </select>
                <p v-if="errors.business_type" class="text-sm text-red-600 mt-1">{{ errors.business_type }}</p>
              </div>

              <!-- Contact Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.business_info.contact_email') }} *
                </label>
                <input
                  v-model="form.contact_email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.business_info.contact_email_placeholder')"
                />
                <p v-if="errors.contact_email" class="text-sm text-red-600 mt-1">{{ errors.contact_email }}</p>
              </div>

              <!-- Contact Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.business_info.contact_phone') }} *
                </label>
                <input
                  v-model="form.contact_phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.business_info.contact_phone_placeholder')"
                />
                <p v-if="errors.contact_phone" class="text-sm text-red-600 mt-1">{{ errors.contact_phone }}</p>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.business_info.description') }}
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.business_info.description_placeholder')"
                ></textarea>
                <p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description }}</p>
              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn-primary">
                {{ t('vendor.onboarding.next') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Location Information -->
        <div v-if="currentStep === 1" class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ t('vendor.onboarding.location_info.title') }}
          </h2>
          
          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.location_info.address') }} *
                </label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.location_info.address_placeholder')"
                />
                <p v-if="errors.address" class="text-sm text-red-600 mt-1">{{ errors.address }}</p>
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.location_info.city') }} *
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.location_info.city_placeholder')"
                />
                <p v-if="errors.city" class="text-sm text-red-600 mt-1">{{ errors.city }}</p>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.location_info.country') }} *
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.location_info.country_placeholder')"
                />
                <p v-if="errors.country" class="text-sm text-red-600 mt-1">{{ errors.country }}</p>
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.location_info.postal_code') }} *
                </label>
                <input
                  v-model="form.postal_code"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.onboarding.location_info.postal_code_placeholder')"
                />
                <p v-if="errors.postal_code" class="text-sm text-red-600 mt-1">{{ errors.postal_code }}</p>
              </div>

              <!-- Latitude/Longitude (Auto-filled) -->
              <div class="md:col-span-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {{ t('vendor.onboarding.location_info.latitude') }}
                    </label>
                    <input
                      v-model="form.latitude"
                      type="number"
                      step="any"
                      readonly
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {{ t('vendor.onboarding.location_info.longitude') }}
                    </label>
                    <input
                      v-model="form.longitude"
                      type="number"
                      step="any"
                      readonly
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400"
                    />
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ t('vendor.onboarding.location_info.coordinates_note') }}
                </p>
              </div>
            </div>

            <div class="flex justify-between">
              <button type="button" @click="prevStep" class="btn-secondary">
                {{ t('vendor.onboarding.previous') }}
              </button>
              <button type="submit" class="btn-primary">
                {{ t('vendor.onboarding.next') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Verification Documents -->
        <div v-if="currentStep === 2" class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ t('vendor.onboarding.verification.title') }}
          </h2>
          
          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="space-y-6">
              <!-- Business License -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.verification.business_license') }} *
                </label>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    ref="businessLicenseInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="(e: Event) => handleFileUpload(e, 'business_license')"
                    class="hidden"
                  />
                  <div v-if="!form.business_license" @click="businessLicenseInput?.click()" class="cursor-pointer">
                    <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600 dark:text-gray-400 mb-2">
                      {{ t('vendor.onboarding.verification.upload_business_license') }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">
                      {{ t('vendor.onboarding.verification.file_formats') }}
                    </p>
                  </div>
                  <div v-else class="flex items-center justify-center space-x-2">
                    <FileText class="w-5 h-5 text-green-600" />
                    <span class="text-green-600 font-medium">{{ form.business_license.name }}</span>
                    <button
                      type="button"
                      @click="removeFile('business_license')"
                      class="text-red-600 hover:text-red-800"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p v-if="errors.business_license" class="text-sm text-red-600 mt-1">{{ errors.business_license }}</p>
              </div>

              <!-- Tax ID Document -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.verification.tax_id') }} *
                </label>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    ref="taxIdInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileUpload($event, 'tax_id')"
                    class="hidden"
                  />
                  <div v-if="!form.tax_id" @click="taxIdInput?.click()" class="cursor-pointer">
                    <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600 dark:text-gray-400 mb-2">
                      {{ t('vendor.onboarding.verification.upload_tax_id') }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">
                      {{ t('vendor.onboarding.verification.file_formats') }}
                    </p>
                  </div>
                  <div v-else class="flex items-center justify-center space-x-2">
                    <FileText class="w-5 h-5 text-green-600" />
                    <span class="text-green-600 font-medium">{{ form.tax_id.name }}</span>
                    <button
                      type="button"
                      @click="removeFile('tax_id')"
                      class="text-red-600 hover:text-red-800"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p v-if="errors.tax_id" class="text-sm text-red-600 mt-1">{{ errors.tax_id }}</p>
              </div>

              <!-- Additional Documents -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.onboarding.verification.additional_docs') }}
                </label>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    ref="additionalDocsInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    @change="handleFileUpload($event, 'additional_docs')"
                    class="hidden"
                  />
                  <div v-if="form.additional_docs.length === 0" @click="additionalDocsInput?.click()" class="cursor-pointer">
                    <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600 dark:text-gray-400 mb-2">
                      {{ t('vendor.onboarding.verification.upload_additional') }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">
                      {{ t('vendor.onboarding.verification.file_formats') }}
                    </p>
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(file, index) in form.additional_docs"
                      :key="index"
                      class="flex items-center justify-center space-x-2"
                    >
                      <FileText class="w-5 h-5 text-green-600" />
                      <span class="text-green-600 font-medium">{{ file.name }}</span>
                      <button
                        type="button"
                        @click="removeAdditionalFile(index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="additionalDocsInput?.click()"
                      class="text-primary-600 hover:text-primary-800 text-sm"
                    >
                      {{ t('vendor.onboarding.verification.add_more') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button type="button" @click="prevStep" class="btn-secondary">
                {{ t('vendor.onboarding.previous') }}
              </button>
              <button type="submit" class="btn-primary">
                {{ t('vendor.onboarding.next') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 4: Terms & Agreement -->
        <div v-if="currentStep === 3" class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ t('vendor.onboarding.terms.title') }}
          </h2>
          
          <form @submit.prevent="submitOnboarding" class="space-y-6">
            <div class="space-y-4">
              <!-- Vendor Agreement -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ t('vendor.onboarding.terms.vendor_agreement') }}
                </h3>
                <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>{{ t('vendor.onboarding.terms.agreement_content') }}</p>
                  <ul class="list-discount list-inside space-y-1">
                    <li>{{ t('vendor.onboarding.terms.terms_1') }}</li>
                    <li>{{ t('vendor.onboarding.terms.terms_2') }}</li>
                    <li>{{ t('vendor.onboarding.terms.terms_3') }}</li>
                    <li>{{ t('vendor.onboarding.terms.terms_4') }}</li>
                    <li>{{ t('vendor.onboarding.terms.terms_5') }}</li>
                  </ul>
                </div>
              </div>

              <!-- Commission Structure -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ t('vendor.onboarding.terms.commission_structure') }}
                </h3>
                <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>{{ t('vendor.onboarding.terms.commission_rate') }}</p>
                  <p>{{ t('vendor.onboarding.terms.payment_terms') }}</p>
                </div>
              </div>

              <!-- Agreement Checkboxes -->
              <div class="space-y-3">
                <div class="flex items-start">
                  <input
                    id="vendor_agreement"
                    v-model="form.agreements.vendor_agreement"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <label for="vendor_agreement" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ t('vendor.onboarding.terms.agree_vendor_agreement') }}
                  </label>
                </div>

                <div class="flex items-start">
                  <input
                    id="commission_agreement"
                    v-model="form.agreements.commission_agreement"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <label for="commission_agreement" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ t('vendor.onboarding.terms.agree_commission') }}
                  </label>
                </div>

                <div class="flex items-start">
                  <input
                    id="data_agreement"
                    v-model="form.agreements.data_agreement"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <label for="data_agreement" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ t('vendor.onboarding.terms.agree_data_processing') }}
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button type="button" @click="prevStep" class="btn-secondary">
                {{ t('vendor.onboarding.previous') }}
              </button>
              <button
                type="submit"
                :disabled="!canSubmit || submitting"
                class="btn-primary flex items-center space-x-2"
              >
                <div v-if="submitting" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>{{ submitting ? t('vendor.onboarding.submitting') : t('vendor.onboarding.submit') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Upload, FileText, X } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'
import type { VendorOnboardingForm } from '../../types/forms'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// File input refs
const businessLicenseInput = ref<HTMLInputElement | null>(null)
const taxIdInput = ref<HTMLInputElement | null>(null)
const additionalDocsInput = ref<HTMLInputElement | null>(null)

// State
const currentStep = ref(0)
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const steps = [
  { key: 'business', title: t('vendor.onboarding.steps.business') },
  { key: 'location', title: t('vendor.onboarding.steps.location') },
  { key: 'verification', title: t('vendor.onboarding.steps.verification') },
  { key: 'terms', title: t('vendor.onboarding.steps.terms') }
]

const form = ref({
  // Business Information
  company_name: '',
  business_type: '',
  contact_email: '',
  contact_phone: '',
  description: '',
  
  // Location Information
  address: '',
  city: '',
  country: '',
  postal_code: '',
  latitude: 0,
  longitude: 0,
  
  // Verification Documents
  business_license: null as File | null,
  tax_id: null as File | null,
  additional_docs: [] as File[],
  
  // Agreements
  agreements: {
    vendor_agreement: false,
    commission_agreement: false,
    data_agreement: false
  }
})

// Computed
const canSubmit = computed(() => {
  return form.value.agreements.vendor_agreement &&
         form.value.agreements.commission_agreement &&
         form.value.agreements.data_agreement
})

// Methods
const getStepClasses = (index: number) => {
  if (index < currentStep.value) {
    return 'bg-primary-600 text-white'
  } else if (index === currentStep.value) {
    return 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
  } else {
    return 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
  }
}

const validateStep = (step: number): boolean => {
  errors.value = {}
  
  switch (step) {
    case 0: // Business Information
      if (!form.value.company_name.trim()) {
        errors.value.company_name = t('vendor.onboarding.validation.company_name_required')
      }
      if (!form.value.business_type) {
        errors.value.business_type = t('vendor.onboarding.validation.business_type_required')
      }
      if (!form.value.contact_email.trim()) {
        errors.value.contact_email = t('vendor.onboarding.validation.contact_email_required')
      }
      if (!form.value.contact_phone.trim()) {
        errors.value.contact_phone = t('vendor.onboarding.validation.contact_phone_required')
      }
      break
      
    case 1: // Location Information
      if (!form.value.address.trim()) {
        errors.value.address = t('vendor.onboarding.validation.address_required')
      }
      if (!form.value.city.trim()) {
        errors.value.city = t('vendor.onboarding.validation.city_required')
      }
      if (!form.value.country.trim()) {
        errors.value.country = t('vendor.onboarding.validation.country_required')
      }
      if (!form.value.postal_code.trim()) {
        errors.value.postal_code = t('vendor.onboarding.validation.postal_code_required')
      }
      break
      
    case 2: // Verification Documents
      if (!form.value.business_license) {
        errors.value.business_license = t('vendor.onboarding.validation.business_license_required')
      }
      if (!form.value.tax_id) {
        errors.value.tax_id = t('vendor.onboarding.validation.tax_id_required')
      }
      break
  }
  
  return Object.keys(errors.value).length === 0
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

type FileField = 'business_license' | 'tax_id' | 'additional_docs';

const handleFileUpload = (event: Event, field: FileField) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  if (field === 'additional_docs') {
    form.value.additional_docs = Array.from(files)
  } else {
    form.value[field] = files[0]
  }
}

const removeFile = (field: FileField) => {
  if (field === 'additional_docs') {
    form.value.additional_docs = []
  } else {
    form.value[field] = null
  }
}

const removeAdditionalFile = (index: number) => {
  form.value.additional_docs.splice(index, 1)
}

const submitOnboarding = async () => {
  if (!validateStep(2) || !canSubmit.value) return
  
  submitting.value = true
  
  try {
    // Create FormData for file uploads
    const formData = new FormData()
    
    // Add business information
    formData.append('company_name', form.value.company_name)
    formData.append('business_type', form.value.business_type)
    formData.append('contact_email', form.value.contact_email)
    formData.append('contact_phone', form.value.contact_phone)
    formData.append('description', form.value.description)
    
    // Add location information
    formData.append('address', form.value.address)
    formData.append('city', form.value.city)
    formData.append('country', form.value.country)
    formData.append('postal_code', form.value.postal_code)
    formData.append('latitude', form.value.latitude.toString())
    formData.append('longitude', form.value.longitude.toString())
    
    // Add documents
    if (form.value.business_license) {
      formData.append('business_license', form.value.business_license)
    }
    if (form.value.tax_id) {
      formData.append('tax_id', form.value.tax_id)
    }
    form.value.additional_docs.forEach((file, index) => {
      formData.append(`additional_docs_${index}`, file)
    })
    
    const response = await api.post('/vendors/onboard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.onboarding.success_title'),
        message: t('vendor.onboarding.success_message')
      })
      
      // Redirect to vendor dashboard
      router.push('/vendor')
    } else {
      throw new Error(response.data.message || t('vendor.onboarding.error_message'))
    }
  } catch (error: any) {
    console.error('Error submitting vendor onboarding:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.onboarding.error_title'),
      message: error.message || t('vendor.onboarding.error_message')
    })
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Check if user is already a vendor
  if (authStore.user?.role === 'vendor') {
    router.push('/vendor')
    return
  }
  
  // Get user's current location for auto-filling coordinates
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.value.latitude = position.coords.latitude
        form.value.longitude = position.coords.longitude
      },
      (error) => {
        console.log('Geolocation error:', error)
      }
    )
  }
})
</script>


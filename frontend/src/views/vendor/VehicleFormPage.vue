<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ isEditing ? t('vendor.vehicle.edit_title') : t('vendor.vehicle.add_title') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ isEditing ? t('vendor.vehicle.edit_subtitle') : t('vendor.vehicle.add_subtitle') }}
            </p>
          </div>
          <RouterLink to="/vendor/vehicles" class="btn-secondary">
            <ArrowLeft class="w-4 h-4 mr-2" />
            {{ t('vendor.vehicle.back_to_vehicles') }}
          </RouterLink>
        </div>
      </div>

      <!-- Vehicle Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <form @submit.prevent="submitVehicle" class="p-8 space-y-8">
          <!-- Basic Information -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('vendor.vehicle.basic_info') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Make -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.make') }} *
                </label>
                <input
                  v-model="form.make"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.vehicle.make_placeholder')"
                />
                <p v-if="errors.make" class="text-sm text-red-600 mt-1">{{ errors.make }}</p>
              </div>

              <!-- Model -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.model') }} *
                </label>
                <input
                  v-model="form.model"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.vehicle.model_placeholder')"
                />
                <p v-if="errors.model" class="text-sm text-red-600 mt-1">{{ errors.model }}</p>
              </div>

              <!-- Year -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.year') }} *
                </label>
                <input
                  v-model="form.year"
                  type="number"
                  required
                  min="1990"
                  :max="new Date().getFullYear() + 1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                />
                <p v-if="errors.year" class="text-sm text-red-600 mt-1">{{ errors.year }}</p>
              </div>

              <!-- License Plate -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.license_plate') }} *
                </label>
                <input
                  v-model="form.license_plate"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.vehicle.license_plate_placeholder')"
                />
                <p v-if="errors.license_plate" class="text-sm text-red-600 mt-1">{{ errors.license_plate }}</p>
              </div>

              <!-- Vehicle Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.type') }} *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                >
                  <option value="">{{ t('vendor.vehicle.select_type') }}</option>
                  <option value="sedan">{{ t('vendor.vehicle.types.sedan') }}</option>
                  <option value="suv">{{ t('vendor.vehicle.types.suv') }}</option>
                  <option value="hatchback">{{ t('vendor.vehicle.types.hatchback') }}</option>
                  <option value="coupe">{{ t('vendor.vehicle.types.coupe') }}</option>
                  <option value="convertible">{{ t('vendor.vehicle.types.convertible') }}</option>
                  <option value="wagon">{{ t('vendor.vehicle.types.wagon') }}</option>
                  <option value="truck">{{ t('vendor.vehicle.types.truck') }}</option>
                  <option value="van">{{ t('vendor.vehicle.types.van') }}</option>
                </select>
                <p v-if="errors.type" class="text-sm text-red-600 mt-1">{{ errors.type }}</p>
              </div>

              <!-- Fuel Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.fuel_type') }} *
                </label>
                <select
                  v-model="form.fuel_type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                >
                  <option value="">{{ t('vendor.vehicle.select_fuel_type') }}</option>
                  <option value="gasoline">{{ t('vendor.vehicle.fuel_types.gasoline') }}</option>
                  <option value="diesel">{{ t('vendor.vehicle.fuel_types.diesel') }}</option>
                  <option value="hybrid">{{ t('vendor.vehicle.fuel_types.hybrid') }}</option>
                  <option value="electric">{{ t('vendor.vehicle.fuel_types.electric') }}</option>
                </select>
                <p v-if="errors.fuel_type" class="text-sm text-red-600 mt-1">{{ errors.fuel_type }}</p>
              </div>

              <!-- Transmission -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.transmission') }} *
                </label>
                <select
                  v-model="form.transmission"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                >
                  <option value="">{{ t('vendor.vehicle.select_transmission') }}</option>
                  <option value="manual">{{ t('vendor.vehicle.transmissions.manual') }}</option>
                  <option value="automatic">{{ t('vendor.vehicle.transmissions.automatic') }}</option>
                </select>
                <p v-if="errors.transmission" class="text-sm text-red-600 mt-1">{{ errors.transmission }}</p>
              </div>

              <!-- Seating Capacity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.seating_capacity') }} *
                </label>
                <input
                  v-model="form.seating_capacity"
                  type="number"
                  required
                  min="2"
                  max="8"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                />
                <p v-if="errors.seating_capacity" class="text-sm text-red-600 mt-1">{{ errors.seating_capacity }}</p>
              </div>
            </div>
          </div>

          <!-- Pricing & Availability -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('vendor.vehicle.pricing_availability') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Price Per Day -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.price_per_day') }} *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    v-model="form.price_per_day"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  />
                </div>
                <p v-if="errors.price_per_day" class="text-sm text-red-600 mt-1">{{ errors.price_per_day }}</p>
              </div>

              <!-- Availability Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.availability_status') }} *
                </label>
                <select
                  v-model="form.rental_status"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                >
                  <option value="available">{{ t('vendor.vehicle.statuses.available') }}</option>
                  <option value="booked">{{ t('vendor.vehicle.statuses.booked') }}</option>
                  <option value="maintenance">{{ t('vendor.vehicle.statuses.maintenance') }}</option>
                  <option value="unavailable">{{ t('vendor.vehicle.statuses.unavailable') }}</option>
                </select>
                <p v-if="errors.rental_status" class="text-sm text-red-600 mt-1">{{ errors.rental_status }}</p>
              </div>

              <!-- Minimum Rental Days -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.minimum_rental_days') }}
                </label>
                <input
                  v-model="form.minimum_rental_days"
                  type="number"
                  min="1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                />
                <p v-if="errors.minimum_rental_days" class="text-sm text-red-600 mt-1">{{ errors.minimum_rental_days }}</p>
              </div>

              <!-- Maximum Rental Days -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.maximum_rental_days') }}
                </label>
                <input
                  v-model="form.maximum_rental_days"
                  type="number"
                  min="1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                />
                <p v-if="errors.maximum_rental_days" class="text-sm text-red-600 mt-1">{{ errors.maximum_rental_days }}</p>
              </div>
            </div>
          </div>

          <!-- Features & Description -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('vendor.vehicle.features_description') }}
            </h2>
            <div class="space-y-6">
              <!-- Features -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.features') }}
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label
                    v-for="feature in availableFeatures"
                    :key="feature.key"
                    class="flex items-center space-x-2"
                  >
                    <input
                      v-model="form.features"
                      :value="feature.key"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {{ t('vendor.vehicle.description') }}
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                  :placeholder="t('vendor.vehicle.description_placeholder')"
                ></textarea>
                <p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description }}</p>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('vendor.vehicle.images') }}
            </h2>
            <div class="space-y-4">
              <!-- Image Upload -->
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="hidden"
                />
                <div @click="$refs.imageInput.click()" class="cursor-pointer">
                  <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-600 dark:text-gray-400 mb-2">
                    {{ t('vendor.vehicle.upload_images') }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    {{ t('vendor.vehicle.image_formats') }}
                  </p>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-if="form.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in form.images"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image.url"
                    :alt="`Vehicle image ${index + 1}`"
                    class="w-full h-32 object-cover rounded-lg"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="opacity-0 group-hover:opacity-100 text-white hover:text-red-300 transition-opacity"
                    >
                      <Trash2 class="w-6 h-6" />
                    </button>
                  </div>
                  <div v-if="index === 0" class="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    {{ t('vendor.vehicle.primary_image') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <RouterLink to="/vendor/vehicles" class="btn-secondary">
              {{ t('vendor.vehicle.cancel') }}
            </RouterLink>
            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary flex items-center space-x-2"
            >
              <div v-if="submitting" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{{ submitting ? t('vendor.vehicle.saving') : (isEditing ? t('vendor.vehicle.update') : t('vendor.vehicle.create')) }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Upload, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// State
const isEditing = computed(() => !!route.params.id)
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  license_plate: '',
  type: '',
  fuel_type: '',
  transmission: '',
  seating_capacity: 5,
  price_per_day: 0,
  rental_status: 'available',
  minimum_rental_days: 1,
  maximum_rental_days: 30,
  features: [] as string[],
  description: '',
  images: [] as Array<{ url: string; file?: File }>
})

const availableFeatures = [
  { key: 'air_conditioning', label: t('vendor.vehicle.features_list.air_conditioning') },
  { key: 'gps', label: t('vendor.vehicle.features_list.gps') },
  { key: 'bluetooth', label: t('vendor.vehicle.features_list.bluetooth') },
  { key: 'usb_charging', label: t('vendor.vehicle.features_list.usb_charging') },
  { key: 'backup_camera', label: t('vendor.vehicle.features_list.backup_camera') },
  { key: 'cruise_control', label: t('vendor.vehicle.features_list.cruise_control') },
  { key: 'leather_seats', label: t('vendor.vehicle.features_list.leather_seats') },
  { key: 'sunroof', label: t('vendor.vehicle.features_list.sunroof') },
  { key: 'heated_seats', label: t('vendor.vehicle.features_list.heated_seats') },
  { key: 'parking_sensors', label: t('vendor.vehicle.features_list.parking_sensors') },
  { key: 'wifi', label: t('vendor.vehicle.features_list.wifi') },
  { key: 'child_seat', label: t('vendor.vehicle.features_list.child_seat') }
]

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.make.trim()) {
    errors.value.make = t('vendor.vehicle.validation.make_required')
  }
  if (!form.value.model.trim()) {
    errors.value.model = t('vendor.vehicle.validation.model_required')
  }
  if (!form.value.year || form.value.year < 1990 || form.value.year > new Date().getFullYear() + 1) {
    errors.value.year = t('vendor.vehicle.validation.year_invalid')
  }
  if (!form.value.license_plate.trim()) {
    errors.value.license_plate = t('vendor.vehicle.validation.license_plate_required')
  }
  if (!form.value.type) {
    errors.value.type = t('vendor.vehicle.validation.type_required')
  }
  if (!form.value.fuel_type) {
    errors.value.fuel_type = t('vendor.vehicle.validation.fuel_type_required')
  }
  if (!form.value.transmission) {
    errors.value.transmission = t('vendor.vehicle.validation.transmission_required')
  }
  if (!form.value.seating_capacity || form.value.seating_capacity < 2 || form.value.seating_capacity > 8) {
    errors.value.seating_capacity = t('vendor.vehicle.validation.seating_capacity_invalid')
  }
  if (!form.value.price_per_day || form.value.price_per_day <= 0) {
    errors.value.price_per_day = t('vendor.vehicle.validation.price_required')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      form.value.images.push({ url, file })
    }
  })
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const submitVehicle = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    const vehicleData = {
      ...form.value,
      vendor_id: authStore.user?.id,
      features: form.value.features.join(',')
    }
    
    let response
    if (isEditing.value) {
      response = await api.put(`/vehicles/${route.params.id}`, vehicleData)
    } else {
      response = await api.post('/vehicles', vehicleData)
    }
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.vehicle.success_title'),
        message: isEditing.value ? t('vendor.vehicle.update_success') : t('vendor.vehicle.create_success')
      })
      
      router.push('/vendor/vehicles')
    } else {
      throw new Error(response.data.message || t('vendor.vehicle.error_message'))
    }
  } catch (error: any) {
    console.error('Error submitting vehicle:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.vehicle.error_title'),
      message: error.message || t('vendor.vehicle.error_message')
    })
  } finally {
    submitting.value = false
  }
}

const loadVehicle = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await api.get(`/vehicles/${route.params.id}`)
    
    if (response.data.success) {
      const vehicle = response.data.data.vehicle
      form.value = {
        ...vehicle,
        features: vehicle.features ? vehicle.features.split(',') : [],
        images: vehicle.images ? vehicle.images.map((url: string) => ({ url })) : []
      }
    }
  } catch (error) {
    console.error('Error loading vehicle:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.vehicle.error_title'),
      message: t('vendor.vehicle.load_error')
    })
  }
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadVehicle()
  }
})
</script>


<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Vehicle Listing -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vehicles</h2>
        <p class="text-gray-600 dark:text-gray-400">Manage your vehicle inventory.</p>
      </div>

      <!-- Action Bar -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="search"
              :placeholder="t('common.search')"
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <!-- Filters -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            v-model="filters.type"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
          </select>
        </div>

        <button
          @click="openCreate()"
          class="btn-primary flex items-center"
        >
          <Plus class="h-5 w-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      <!-- Vehicle Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden group"
        >
          <!-- Vehicle Image -->
          <div class="relative h-48">
            <img
              :src="vehicle.image || '/images/defaults/car-placeholder.jpg'"
              :alt="`${vehicle.make} ${vehicle.model}`"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-lg font-semibold text-white">{{ vehicle.make }} {{ vehicle.model }}</h3>
              <p class="text-sm text-gray-200">{{ vehicle.license_plate || 'No license' }}</p>
            </div>
            <div
              :class="[
                'absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium',
                getStatusClass(vehicle.rental_status)
              ]"
            >
              {{ vehicle.rental_status }}
            </div>
          </div>

          <!-- Vehicle Details -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Daily rate</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(vehicle.price_per_day) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500 dark:text-gray-400">Bookings</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ getVehicleBookings(vehicle.id) }}
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Availability</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getVehicleAvailability(vehicle.id) }}%
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getVehicleRating(vehicle.id) }} ★
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                @click="openEdit(vehicle)"
                class="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {{ t('common.edit') }}
              </button>
              <button
                @click="removeVehicle(vehicle.id)"
                class="flex-1 px-3 py-2 text-sm font-medium text-red-600 rounded-md border border-red-300 hover:bg-red-50 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30"
              >
                {{ t('common.delete') || 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredVehicles.length === 0"
        class="text-center py-12"
      >
        <Car class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          {{ t('vendor.vehicle_management.no_vehicles') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('vendor.vehicle_management.no_vehicles_desc') }}
        </p>
        <div class="mt-6">
          <button
            @click="openCreate()"
            class="btn-primary flex items-center justify-center"
          >
            <Plus class="h-5 w-5 mr-2" />
            {{ t('vendor.vehicle_management.add_vehicle') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Vehicle Modal -->
    <TransitionRoot appear :show="showForm" as="template">
      <Dialog as="div" @close="closeForm" class="relative z-10">
        <div class="fixed inset-0 bg-black/40" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {{ formMode === 'create' ? 'Add Vehicle' : 'Edit Vehicle' }}
              </h3>

              <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                  <input v-model.trim="form.name" type="text" class="input-field" />
                  <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      License Plate
                    </label>
                    <input v-model.trim="form.licensePlate" type="text" class="input-field" />
                    <p v-if="errors.licensePlate" class="text-sm text-red-600 mt-1">
                      {{ errors.licensePlate }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Type</label>
                    <select v-model="form.type" class="input-field">
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                    </select>
                    <p v-if="errors.type" class="text-sm text-red-600 mt-1">{{ errors.type }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Price Per Day ({{ localeStore.currentCurrency }})
                    </label>
                    <input
                      v-model.number="form.pricePerDay"
                      type="number"
                      min="0"
                      step="1"
                      class="input-field"
                    />
                    <p v-if="errors.pricePerDay" class="text-sm text-red-600 mt-1">{{ errors.pricePerDay }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
                    <select v-model="form.status" class="input-field">
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <p v-if="errors.status" class="text-sm text-red-600 mt-1">{{ errors.status }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Image URL
                  </label>
                  <input v-model.trim="form.image" type="url" class="input-field" placeholder="https://..." />
                </div>

                <div class="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    @click="closeForm"
                    class="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                  >
                    {{ t('common.cancel') || 'Cancel' }}
                  </button>
                  <button type="submit" class="btn-primary">
                    {{ formMode === 'create' ? (t('common.save') || 'Save') : (t('common.save') || 'Save') }}
                  </button>
                </div>

                <p v-if="errors.submit" class="text-sm text-red-600 mt-2">
                  {{ errors.submit }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TransitionRoot, Dialog } from '@headlessui/vue'
import { Car, Plus, Search } from 'lucide-vue-next'
import { useTranslation } from '../../../services/i18n'
import { useLocaleStore } from '../../../stores/locale'
import { useAuthStore } from '../../../stores/auth'
import { api } from '../../../services/api'
import type { Vehicle, VehicleFormData } from '../../../types/vehicle'

interface AutoDbRow {
  id_auto: number
  id_vendedor: number
  id_modelo: number
  patente: string
  color: string | null
  transmision: string | null
  tipo_motor: string | null
  caracteristicas: string | null
  imagenes: string | null
  descripcion: string | null
  kilometraje: number | null
  precio: string
  estado: string
  ubicacion: string | null
  fecha_registro: string
}

interface VehicleApiResponse {
  success: boolean
  data: Vehicle[]
}

interface BackendAuto {
  id_auto: number
  id_vendedor: number
  id_modelo: number
  patente: string
  color: string
  transmision: string
  tipo_motor: string
  caracteristicas: string | null
  imagenes: string | null
  descripcion: string | null
  kilometraje: number
  precio: string
  estado: string
  ubicacion: string
  fecha_registro: string
}


const { t } = useTranslation()
const localeStore = useLocaleStore()
const authStore = useAuthStore()

const search = ref('')
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const loading = ref(false)

const form = ref<VehicleFormData>({
  name: '',
  licensePlate: '',
  type: 'sedan',
  pricePerDay: 0,
  status: 'available',
  image: ''
})

const errors = ref<Record<string, string>>({})
const filters = ref({
  status: '',
  type: ''
})

// Real data from API
const vehicles = ref<any[]>([])
const mapAutoRowToVehicle = (row: AutoDbRow) => {
  return {
    // ID que usa la vista
    id: row.id_auto,

    // Por ahora ponemos algo genérico para marca / modelo
    make: 'Vehículo',
    model: `ID modelo ${row.id_modelo}`,

    // Patente
    license_plate: row.patente,

    // Estado: traducimos desde lo que tengas en la BD
    // puedes ajustar estas reglas si usas otros estados
    rental_status:
      row.estado === 'disponible'
        ? 'available'
        : row.estado === 'mantenimiento'
          ? 'maintenance'
          : 'booked',

    // Tipo genérico, luego lo podemos refinar
    type: 'sedan',

    // Precio: viene como string, lo convertimos a número
    price_per_day: Number(row.precio),

    // Imagen: por ahora ninguna
    image: null,

    // Si en el futuro guardas URLs separadas por coma, aquí podrías hacer split
    images: [],
  }
}


// Computed: filtered list
const filteredVehicles = computed(() => {
  return vehicles.value.filter((vehicle: Vehicle) => {
    if (filters.value.status && vehicle.rental_status !== filters.value.status) return false
    if (filters.value.type && vehicle.type !== filters.value.type) return false

    if (search.value) {
      const q = search.value.toLowerCase()
      const makeMatch = vehicle.make?.toLowerCase().includes(q)
      const modelMatch = vehicle.model?.toLowerCase().includes(q)
      if (!makeMatch && !modelMatch) return false
    }

    return true
  })
})

// Helpers
const getStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'booked':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const formatCurrency = (amount: number) => {
  if (!amount) return '0'
  return new Intl.NumberFormat(
    localeStore.currentCountry?.code.toLowerCase() || 'es-CL',
    {
      style: 'currency',
      currency: localeStore.currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).format(amount)
}

// Placeholder stats (luego puedes conectarlos a datos reales)
const getVehicleBookings = (vehicleId: number) => Math.floor(Math.random() * 10) + 1
const getVehicleAvailability = (vehicleId: number) => Math.floor(Math.random() * 30) + 70
const getVehicleRating = (vehicleId: number) => (Math.random() * 2 + 3).toFixed(1)

// Form helpers
const openCreate = () => {
  formMode.value = 'create'
  errors.value = {}
  form.value = {
    name: '',
    licensePlate: '',
    type: 'sedan',
    pricePerDay: 0,
    status: 'available',
    image: ''
  }
  showForm.value = true
}

const openEdit = (vehicle: Vehicle) => {
  formMode.value = 'edit'
  errors.value = {}
  form.value = {
    id: vehicle.id,
    name: `${vehicle.make} ${vehicle.model}`.trim(),
    licensePlate: vehicle.license_plate || '',
    type: vehicle.type || 'sedan',
    pricePerDay: vehicle.price_per_day || 0,
    status: vehicle.rental_status || 'available',
    image: vehicle.images?.[0] || vehicle.image || ''
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const validate = () => {
  const e: Record<string, string> = {}

  if (!form.value.name) e.name = 'Name is required'
  if (!form.value.licensePlate) e.licensePlate = 'License plate is required'
  if (!form.value.type) e.type = 'Type is required'
  if (form.value.pricePerDay == null || form.value.pricePerDay < 0)
    e.pricePerDay = 'Price must be non-negative'
  if (!form.value.status) e.status = 'Status is required'

  errors.value = e
  return Object.keys(e).length === 0
}

const submitForm = async () => {
  if (!validate()) return

  try {
    const [make, ...modelParts] = form.value.name.split(' ')
    const vehicleData: Partial<Vehicle> = {
      make,
      model: modelParts.join(' '),
      license_plate: form.value.licensePlate,
      type: form.value.type,
      price_per_day: form.value.pricePerDay,
      rental_status: form.value.status,
      image: form.value.image || undefined
    }

    if (formMode.value === 'create') {
      if (!authStore.user?.id) throw new Error('User ID not found')
      vehicleData.vendor_id = authStore.user.id
      await api.post<Vehicle>('/vehicles', vehicleData)
    } else {
      if (!form.value.id) throw new Error('Vehicle ID not found')
      await api.put<Vehicle>(`/vehicles/${form.value.id}`, vehicleData)
    }

    await loadVehicles()
    closeForm()
  } catch (error) {
    console.error('Error saving vehicle:', error)
    errors.value.submit =
      error instanceof Error ? error.message : 'Error saving vehicle'
  }
}

const removeVehicle = async (id: number) => {
  if (!confirm('Are you sure you want to delete this vehicle?')) return

  try {
    await api.delete(`/vehicles/${id}`)
    await loadVehicles()
  } catch (error) {
    console.error('Error deleting vehicle:', error)
  }
}

// Load vehicles from API
const loadVehicles = async () => {
try {
    loading.value = true
    console.log('🚗 Llamando a /autos desde el frontend...')

    // 1) Pedimos los autos al backend
    //    Golpea:  http://127.0.0.1:8000/api/autos
    const response = await api.get<AutoDbRow[]>('/autos')

    console.log('✅ Respuesta cruda de /autos:', response)

    // 2) Tomamos las filas que vienen desde la BD
    const rows = response.data ?? []

    // 3) Convertimos cada fila de la BD al formato que usa el frontend
    vehicles.value = rows.map((row: AutoDbRow) => mapAutoRowToVehicle(row))

    console.log('🚗 Vehicles mapeados para el front:', vehicles.value)
  } catch (error) {
    console.error('Error loading vehicles:', error)
  } finally {
    loading.value = false
  }
}


// Load on mount
onMounted(() => {
  loadVehicles()
})
</script>

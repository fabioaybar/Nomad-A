<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.maintenance.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.subtitle') }}</p>
    </div>

    <!-- Maintenance Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Scheduled Maintenance -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.scheduled') }}</h3>
            <div class="text-yellow-500">
              <Calendar class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.scheduled }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stats.overdue }} {{ t('vendor.maintenance.overdue') }}
          </div>
        </div>

        <!-- In Progress -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.in_progress') }}</h3>
            <div class="text-blue-500">
              <Wrench class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.inProgress }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('vendor.maintenance.active_tasks') }}
        </div>
      </div>

        <!-- Completed This Month -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.completed') }}</h3>
            <div class="text-green-500">
              <CheckCircle class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.completed }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('vendor.maintenance.this_month') }}
          </div>
        </div>

        <!-- Total Cost -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.total_cost') }}</h3>
            <div class="text-red-500">
              <DollarSign class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.totalCost) }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('vendor.maintenance.this_month') }}
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="search"
              :placeholder="t('vendor.maintenance.search_placeholder')"
              class="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.maintenance.all_statuses') }}</option>
            <option value="scheduled">{{ t('vendor.maintenance.scheduled') }}</option>
            <option value="in_progress">{{ t('vendor.maintenance.in_progress') }}</option>
            <option value="completed">{{ t('vendor.maintenance.completed') }}</option>
            <option value="cancelled">{{ t('vendor.maintenance.cancelled') }}</option>
          </select>

          <!-- Type Filter -->
          <select
            v-model="filters.type"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.maintenance.all_types') }}</option>
            <option value="routine">{{ t('vendor.maintenance.types.routine') }}</option>
            <option value="repair">{{ t('vendor.maintenance.types.repair') }}</option>
            <option value="inspection">{{ t('vendor.maintenance.types.inspection') }}</option>
            <option value="cleaning">{{ t('vendor.maintenance.types.cleaning') }}</option>
          </select>
        </div>

        <div class="flex gap-2">
          <button @click="exportMaintenance" class="btn-secondary flex items-center">
            <Download class="w-4 h-4 mr-2" />
            {{ t('vendor.maintenance.export') }}
          </button>
          <button @click="openScheduleModal" class="btn-primary flex items-center">
            <Plus class="w-4 h-4 mr-2" />
            {{ t('vendor.maintenance.schedule') }}
          </button>
        </div>
            </div>

      <!-- Maintenance Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.maintenance.loading') }}</p>
        </div>

        <div v-else-if="filteredMaintenance.length === 0" class="p-8 text-center">
          <Wrench class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('vendor.maintenance.no_maintenance') }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.maintenance.no_maintenance_desc') }}</p>
    </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.vehicle') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.type') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.title') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.scheduled_date') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.cost') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.status') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.maintenance.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="maintenance in pagedMaintenance" :key="maintenance.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Car class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ maintenance.vehicle?.make }} {{ maintenance.vehicle?.model }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ maintenance.vehicle?.license_plate }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeClass(maintenance.type)">
                    {{ t(`vendor.maintenance.types.${maintenance.type}`) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ maintenance.title }}</div>
                  <div v-if="maintenance.description" class="text-sm text-gray-500 dark:text-gray-400">{{ maintenance.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(maintenance.scheduled_date) }}</div>
                  <div v-if="maintenance.status === 'scheduled'" :class="getDueDateClass(maintenance.scheduled_date)">
                    {{ getDaysUntilDue(maintenance.scheduled_date) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                  {{ maintenance.cost ? formatCurrency(maintenance.cost) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="getStatusClass(maintenance.status)">
                    {{ t(`vendor.maintenance.statuses.${maintenance.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewMaintenance(maintenance)"
                      class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      :title="t('vendor.maintenance.view_details')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      v-if="maintenance.status === 'scheduled'"
                      @click="startMaintenance(maintenance)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      :title="t('vendor.maintenance.start')"
                    >
                      <Play class="w-4 h-4" />
                    </button>
                    <button
                      v-if="maintenance.status === 'in_progress'"
                      @click="completeMaintenance(maintenance)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      :title="t('vendor.maintenance.complete')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                  <button 
                      v-if="['scheduled', 'in_progress'].includes(maintenance.status)"
                      @click="cancelMaintenance(maintenance)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      :title="t('vendor.maintenance.cancel')"
                    >
                      <XCircle class="w-4 h-4" />
                  </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredMaintenance.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('vendor.maintenance.showing') }} {{ startIndex + 1 }}–{{ Math.min(startIndex + pageSize, filteredMaintenance.length) }} {{ t('vendor.maintenance.of') }} {{ filteredMaintenance.length }}
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="page === 1"
              @click="page--"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.maintenance.previous') }}
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('vendor.maintenance.page') }} {{ page }}
            </span>
            <button
              :disabled="page >= totalPages"
              @click="page++"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.maintenance.next') }}
            </button>
        </div>
      </div>
    </div>
  
  <!-- Schedule Maintenance Modal -->
  <div v-if="showScheduleModal" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="closeScheduleModal"></div>
        <div class="relative max-w-2xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.schedule_maintenance') }}</h3>
            <button @click="closeScheduleModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="submitSchedule" class="space-y-6">
            <!-- Vehicle Selection -->
        <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.vehicle') }} *
              </label>
              <select
                v-model="scheduleForm.vehicle_id"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
              >
                <option value="">{{ t('vendor.maintenance.select_vehicle') }}</option>
                <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                  {{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.license_plate }})
                </option>
              </select>
              <p v-if="errors.vehicle_id" class="text-sm text-red-600 mt-1">{{ errors.vehicle_id }}</p>
        </div>

            <!-- Maintenance Type -->
        <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.type') }} *
              </label>
              <select
                v-model="scheduleForm.type"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
              >
                <option value="">{{ t('vendor.maintenance.select_type') }}</option>
                <option value="routine">{{ t('vendor.maintenance.types.routine') }}</option>
                <option value="repair">{{ t('vendor.maintenance.types.repair') }}</option>
                <option value="inspection">{{ t('vendor.maintenance.types.inspection') }}</option>
                <option value="cleaning">{{ t('vendor.maintenance.types.cleaning') }}</option>
              </select>
          <p v-if="errors.type" class="text-sm text-red-600 mt-1">{{ errors.type }}</p>
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.title') }} *
              </label>
              <input
                v-model="scheduleForm.title"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                :placeholder="t('vendor.maintenance.title_placeholder')"
              />
              <p v-if="errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.description') }}
              </label>
              <textarea
                v-model="scheduleForm.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                :placeholder="t('vendor.maintenance.description_placeholder')"
              ></textarea>
            </div>

            <!-- Scheduled Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.scheduled_date') }} *
              </label>
              <input
                v-model="scheduleForm.scheduled_date"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
              />
              <p v-if="errors.scheduled_date" class="text-sm text-red-600 mt-1">{{ errors.scheduled_date }}</p>
            </div>

            <!-- Estimated Cost -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.maintenance.estimated_cost') }}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  v-model="scheduleForm.cost"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="closeScheduleModal" class="btn-secondary">
                {{ t('vendor.maintenance.cancel') }}
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary flex items-center space-x-2">
                <div v-if="submitting" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>{{ submitting ? t('vendor.maintenance.saving') : t('vendor.maintenance.schedule') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Maintenance Detail Modal -->
      <div v-if="selectedMaintenance" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="selectedMaintenance = null"></div>
        <div class="relative max-w-4xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.maintenance.maintenance_details') }}</h3>
            <button @click="selectedMaintenance = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Maintenance Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.maintenance.maintenance_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.title') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedMaintenance.title }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.type') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ t(`vendor.maintenance.types.${selectedMaintenance.type}`) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.status') }}:</span>
                  <span :class="getStatusClass(selectedMaintenance.status)">
                    {{ t(`vendor.maintenance.statuses.${selectedMaintenance.status}`) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.scheduled_date') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedMaintenance.scheduled_date) }}</span>
                </div>
                <div v-if="selectedMaintenance.completed_date" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.completed_date') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedMaintenance.completed_date) }}</span>
                </div>
                <div v-if="selectedMaintenance.cost" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.cost') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(selectedMaintenance.cost) }}</span>
                </div>
              </div>
            </div>

            <!-- Vehicle Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.maintenance.vehicle_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.vehicle') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedMaintenance.vehicle?.make }} {{ selectedMaintenance.vehicle?.model }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.license_plate') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedMaintenance.vehicle?.license_plate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.maintenance.year') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedMaintenance.vehicle?.year }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="selectedMaintenance.description" class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.maintenance.description') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-gray-900 dark:text-white">{{ selectedMaintenance.description }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.maintenance.actions') }}</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="selectedMaintenance.status === 'scheduled'"
                  @click="startMaintenance(selectedMaintenance)"
                  class="btn-primary text-sm"
                >
                  {{ t('vendor.maintenance.start') }}
                </button>
                <button
                  v-if="selectedMaintenance.status === 'in_progress'"
                  @click="completeMaintenance(selectedMaintenance)"
                  class="btn-primary text-sm"
                >
                  {{ t('vendor.maintenance.complete') }}
                </button>
                <button
                  v-if="['scheduled', 'in_progress'].includes(selectedMaintenance.status)"
                  @click="cancelMaintenance(selectedMaintenance)"
                  class="btn-secondary text-sm"
                >
                  {{ t('vendor.maintenance.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Calendar, 
  Wrench, 
  CheckCircle, 
  DollarSign, 
  Search, 
  Download, 
  Plus,
  Eye, 
  Car, 
  Play,
  XCircle,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth'
import { useNotificationStore } from '../../../stores/notifications'
import { useTranslation } from '../../../services/i18n'
import { api } from '../../../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// Types
interface Maintenance {
  id: number
  vehicle_id: number
  vendor_id: number
  type: 'routine' | 'repair' | 'inspection' | 'cleaning'
  title: string
  description?: string
  cost?: number
  scheduled_date: string
  completed_date?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  vehicle?: any
}

interface Vehicle {
  id: number
  make: string
  model: string
  license_plate: string
  year: number
}

// State
const maintenance = ref<Maintenance[]>([])
const vehicles = ref<Vehicle[]>([])
const loading = ref(false)
const selectedMaintenance = ref<Maintenance | null>(null)
const showScheduleModal = ref(false)
const submitting = ref(false)
const search = ref('')
const errors = ref<Record<string, string>>({})
const filters = ref({
  status: '',
  type: ''
})
const page = ref(1)
const pageSize = 10

const scheduleForm = ref({
  vehicle_id: '',
  type: '',
  title: '',
  description: '',
  scheduled_date: '',
  cost: ''
})

const stats = ref({
  scheduled: 0,
  overdue: 0,
  inProgress: 0,
  completed: 0,
  totalCost: 0
})

// Computed
const filteredMaintenance = computed(() => {
  let filtered = maintenance.value
  
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.vehicle?.make.toLowerCase().includes(query) ||
      item.vehicle?.model.toLowerCase().includes(query) ||
      item.vehicle?.license_plate.toLowerCase().includes(query)
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(item => item.status === filters.value.status)
  }
  
  if (filters.value.type) {
    filtered = filtered.filter(item => item.type === filters.value.type)
  }
  
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const pagedMaintenance = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredMaintenance.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredMaintenance.value.length / pageSize))
const startIndex = computed(() => (page.value - 1) * pageSize)

// Methods
const loadMaintenance = async () => {
  try {
    loading.value = true
    console.log('🔧 Loading maintenance from API...')
    
    // Get vendor's vehicles first
    const vehiclesResponse = await api.get('/vendors/vehicles', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    vehicles.value = vehiclesResponse.data.data || vehiclesResponse.data || []
    
    // Get maintenance records
    const response = await api.get('/vendors/maintenance', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log('🔧 Maintenance API Response:', response.data)
    
    if (response.data.success) {
      maintenance.value = response.data.data || []
      console.log('🔧 Maintenance loaded:', maintenance.value.length, 'records')
      
      // Calculate stats
      calculateStats()
    }
  } catch (error) {
    console.error('Error loading maintenance:', error)
    maintenance.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const now = new Date()
  
  stats.value = {
    scheduled: maintenance.value.filter(m => m.status === 'scheduled').length,
    overdue: maintenance.value.filter(m => 
      m.status === 'scheduled' && new Date(m.scheduled_date) < now
    ).length,
    inProgress: maintenance.value.filter(m => m.status === 'in_progress').length,
    completed: maintenance.value.filter(m => 
      m.status === 'completed' && 
      new Date(m.completed_date || '').getMonth() === now.getMonth()
    ).length,
    totalCost: maintenance.value
      .filter(m => m.status === 'completed' && 
        new Date(m.completed_date || '').getMonth() === now.getMonth())
      .reduce((sum, m) => sum + (m.cost || 0), 0)
  }
}

const loadVehicles = async () => {
  try {
    const response = await api.get(`/users/${authStore.user?.id}/vehicles`)
    vehicles.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading vehicles:', error)
  }
}

const openScheduleModal = () => {
  errors.value = {}
  scheduleForm.value = {
    vehicle_id: '',
    type: '',
    title: '',
    description: '',
    scheduled_date: '',
    cost: ''
  }
  showScheduleModal.value = true
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
}

const validateSchedule = (): boolean => {
  errors.value = {}
  
  if (!scheduleForm.value.vehicle_id) {
    errors.value.vehicle_id = t('vendor.maintenance.validation.vehicle_required')
  }
  if (!scheduleForm.value.type) {
    errors.value.type = t('vendor.maintenance.validation.type_required')
  }
  if (!scheduleForm.value.title.trim()) {
    errors.value.title = t('vendor.maintenance.validation.title_required')
  }
  if (!scheduleForm.value.scheduled_date) {
    errors.value.scheduled_date = t('vendor.maintenance.validation.date_required')
  }
  
  return Object.keys(errors.value).length === 0
}

const submitSchedule = async () => {
  if (!validateSchedule()) return
  
  submitting.value = true
  
  try {
    const response = await api.post('/maintenance', {
      ...scheduleForm.value,
      vendor_id: authStore.user?.id,
      cost: scheduleForm.value.cost ? parseFloat(scheduleForm.value.cost) : null
    })
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.maintenance.success_title'),
        message: t('vendor.maintenance.schedule_success')
      })
      
      closeScheduleModal()
      loadMaintenance()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.maintenance.error_title'),
      message: error.message || t('vendor.maintenance.schedule_error')
    })
  } finally {
    submitting.value = false
  }
}

const viewMaintenance = (item: Maintenance) => {
  selectedMaintenance.value = item
}

const startMaintenance = async (item: Maintenance) => {
  try {
    const response = await api.post(`/maintenance/${item.id}/start`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.maintenance.success_title'),
        message: t('vendor.maintenance.start_success')
      })
      
      // Update local status
      item.status = 'in_progress'
      selectedMaintenance.value = null
      calculateStats()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.maintenance.error_title'),
      message: error.message || t('vendor.maintenance.start_error')
    })
  }
}

const completeMaintenance = async (item: Maintenance) => {
  try {
    const response = await api.post(`/maintenance/${item.id}/complete`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.maintenance.success_title'),
        message: t('vendor.maintenance.complete_success')
      })
      
      // Update local status
      item.status = 'completed'
      item.completed_date = new Date().toISOString()
      selectedMaintenance.value = null
      calculateStats()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.maintenance.error_title'),
      message: error.message || t('vendor.maintenance.complete_error')
    })
  }
}

const cancelMaintenance = async (item: Maintenance) => {
  if (!confirm(t('vendor.maintenance.cancel_confirm'))) return
  
  try {
    const response = await api.post(`/maintenance/${item.id}/cancel`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.maintenance.success_title'),
        message: t('vendor.maintenance.cancel_success')
      })
      
      // Update local status
      item.status = 'cancelled'
      selectedMaintenance.value = null
      calculateStats()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.maintenance.error_title'),
      message: error.message || t('vendor.maintenance.cancel_error')
    })
  }
}

const exportMaintenance = () => {
  // TODO: Implement maintenance export
  notificationStore.addNotification({
    type: 'info',
    title: t('vendor.maintenance.export_title'),
    message: t('vendor.maintenance.export_message')
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes = {
    scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getTypeClass = (type: string) => {
  const classes = {
    routine: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    repair: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    inspection: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cleaning: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getDueDateClass = (dateString: string) => {
  const daysUntilDue = Math.floor((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDue < 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  } else if (daysUntilDue < 7) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  } else {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
}

const getDaysUntilDue = (dateString: string) => {
  const daysUntilDue = Math.floor((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} ${t('vendor.maintenance.days_overdue')}`
  } else if (daysUntilDue === 0) {
    return t('vendor.maintenance.due_today')
  } else {
    return `${daysUntilDue} ${t('vendor.maintenance.days_remaining')}`
  }
}

// Lifecycle
onMounted(() => {
  loadMaintenance()
  loadVehicles()
})
</script>
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('booking.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('booking.subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">{{ t('booking.loading') }}</p>
      </div>

      <!-- Booking Form -->
      <div v-else-if="vehicle" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <!-- Vehicle Summary -->
        <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <div class="w-24 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-md">
              <Car class="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ vehicle.make }} {{ vehicle.model }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">{{ vehicle.year }} • {{ vehicle.color }}</p>
              <p class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(vehicle.price_per_day) }}/day</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitBooking" class="space-y-6">
          <!-- Date Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('booking.pickup_date') }}
              </label>
              <input
                v-model="booking.start_date"
                type="date"
                :min="today"
                required
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('booking.return_date') }}
              </label>
              <input
                v-model="booking.end_date"
                type="date"
                :min="booking.start_date || today"
                required
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          <!-- Pick-up Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('booking.pickup_location') }}
            </label>
            <input
              v-model="booking.pickup_location"
              type="text"
              :placeholder="t('booking.pickup_location')"
              required
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
          </div>

          <!-- Drop-off Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('booking.return_location') }}
            </label>
            <input
              v-model="booking.dropoff_location"
              type="text"
              :placeholder="t('booking.return_location')"
              required
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
          </div>

          <!-- Additional Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('booking.notes') }}
            </label>
            <textarea
              v-model="booking.notes"
              rows="3"
              :placeholder="t('booking.notes')"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            ></textarea>
          </div>

          <!-- Cost Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('booking.total_cost') }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ t('booking.daily_rate') }}</span>
                <span class="text-gray-900 dark:text-gray-100">{{ formatCurrency(vehicle.price_per_day) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ t('booking.number_of_days') }}</span>
                <span class="text-gray-900 dark:text-gray-100">{{ numberOfDays }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ t('booking.subtotal') }}</span>
                <span class="text-gray-900 dark:text-gray-100">{{ formatCurrency(originalCost) }}</span>
              </div>
              
              <!-- Discount Section -->
              <div v-if="rewardsStore.hasActiveDiscount" class="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div class="flex justify-between text-green-600 dark:text-green-400">
                  <span class="text-sm">{{ t('booking.discount') }} ({{ rewardsStore.activeDiscount?.name }})</span>
                  <span class="text-sm font-medium">-{{ formatCurrency(discountAmount) }}</span>
                </div>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div class="flex justify-between font-semibold text-lg">
                  <span class="text-gray-900 dark:text-gray-100">{{ t('booking.total_cost') }}</span>
                  <span class="text-primary-600 dark:text-primary-400">{{ formatCurrency(totalCost) }}</span>
                </div>
              </div>
              
              <!-- Points Earned Section -->
              <div v-if="numberOfDays > 0" class="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div class="flex justify-between text-yellow-600 dark:text-yellow-400">
                  <span class="text-sm font-medium">{{ t('booking.points_earned') }}</span>
                  <span class="text-sm font-bold">+{{ calculatePointsEarned() }} {{ t('rewards.points') }}</span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t('booking.points_calculation', { days: numberOfDays, base: numberOfDays * 40, multiplier: Math.floor((numberOfDays * 0.05) * 100) }) }}
                </div>
              </div>
            </div>
            
            <!-- Discount Management -->
            <div v-if="rewardsStore.hasActiveDiscount" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-800 dark:text-green-200">{{ t('booking.active_discount') }}</p>
                  <p class="text-xs text-green-600 dark:text-green-300">{{ rewardsStore.activeDiscount?.description }}</p>
                </div>
                <button
                  @click="rewardsStore.clearActiveDiscount()"
                  class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  {{ t('booking.remove_discount') }}
                </button>
              </div>
            </div>
            
            <!-- Available Discounts -->
            <div v-if="!rewardsStore.hasActiveDiscount && rewardsStore.availableDiscounts.length > 0" class="mt-4">
              <button
                @click="showDiscountModal = true"
                class="w-full text-sm px-3 py-2 border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                {{ t('booking.apply_discount') }}
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <RouterLink
              :to="`/vehicles/${vehicle.id}`"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('booking.cancel') }}
            </RouterLink>
            <button
              type="submit"
              :disabled="submitting"
              class="px-8 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {{ submitting ? t('booking.processing') : t('booking.confirm_booking') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <Car class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('booking.vehicle_not_found') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('booking.vehicle_not_found_desc') }}</p>
        <RouterLink
          to="/vehicles"
          class="bg-primary-600 dark:bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          {{ t('booking.browse_vehicles') }}
        </RouterLink>
      </div>
    </div>

    <!-- Payment Method Selection Modal -->
    <div v-if="showPaymentMethodModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('booking.select_payment_method') }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ t('booking.total_amount') }}: {{ formatCurrency(totalCost) }}</p>
        </div>
        
        <div class="space-y-3">
          <!-- Webpay Option -->
          <button
            @click="processPayment('webpay')"
            class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <img 
                src="/SVG_Webpay/_FondoNegro_SVG/_300px/1.Webpay_FN_300px.svg" 
                alt="Webpay" 
                class="h-8 w-auto"
              />
              <span class="text-gray-900 dark:text-white font-medium">{{ t('booking.webpay') }}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Credit Card Option -->
          <button
            @click="processPayment('credit_card')"
            class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v6h16v-6H4z"/>
                </svg>
              </div>
              <span class="text-gray-900 dark:text-white font-medium">{{ t('booking.credit_card') }}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Debit Card Option -->
          <button
            @click="processPayment('debit_card')"
            class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v6h16v-6H4z"/>
                </svg>
              </div>
              <span class="text-gray-900 dark:text-white font-medium">{{ t('booking.debit_card') }}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Bank Transfer Option -->
          <button
            @click="processPayment('bank_transfer')"
            class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span class="text-gray-900 dark:text-white font-medium">{{ t('booking.bank_transfer') }}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="showPaymentMethodModal = false"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('booking.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Discount Selection Modal -->
    <div v-if="showDiscountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('booking.select_discount') }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ t('booking.available_points') }}: {{ rewardsStore.userRewards.points }}</p>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="discount in rewardsStore.availableDiscounts"
            :key="discount.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ discount.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ discount.description }}</p>
                <p class="text-lg font-bold text-green-600 mt-1">
                  {{ discount.type === 'percentage' ? t('rewards.discount.percentage', { percentage: discount.value }) : t('rewards.discount.fixed', { amount: discount.value }) }}
                </p>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ discount.pointsRequired }} {{ t('rewards.points') }} {{ t('common.required') }}
                </div>
              </div>
              <button
                @click="applyDiscountAndClose(discount)"
                :disabled="rewardsStore.userRewards.points < discount.pointsRequired"
                class="ml-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ t('rewards.activate') }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showDiscountModal = false"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('booking.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Processing Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <!-- Processing State -->
          <div v-if="paymentStatus === 'processing'" class="mb-6">
            <div class="flex items-center justify-center mb-4">
              <!-- Show Webpay logo only if Webpay is selected -->
              <img 
                v-if="selectedPaymentMethod === 'webpay'"
                src="/SVG_Webpay/_FondoNegro_SVG/_300px/1.Webpay_FN_300px.svg" 
                alt="Webpay" 
                class="h-12 w-auto mr-4"
              />
              <!-- Show generic payment icon for other methods -->
              <div 
                v-else
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4"
              >
                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v6h16v-6H4z"/>
                </svg>
              </div>
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('booking.processing_payment') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ selectedPaymentMethod === 'webpay' ? t('booking.webpay_processing_desc') : t('booking.payment_processing_desc') }}
            </p>
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {{ t('booking.transaction_id') }}: {{ transactionId }}
            </div>
          </div>

          <!-- Success State -->
          <div v-else-if="paymentStatus === 'success'" class="mb-6">
            <div class="flex items-center justify-center mb-4">
              <!-- Show Webpay logo only if Webpay was used -->
              <img 
                v-if="selectedPaymentMethod === 'webpay'"
                src="/SVG_Webpay/_FondoBlanco_SVG/_300px/1.Webpay_FB_300px.svg" 
                alt="Webpay" 
                class="h-12 w-auto mr-4"
              />
              <!-- Show generic success icon for other methods -->
              <div 
                v-else
                class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4"
              >
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('booking.payment_success') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('booking.booking_confirmed') }}</p>
            
            <!-- Points Earned Notification -->
            <div v-if="calculatePointsEarned() > 0" class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">{{ t('booking.points_earned') }}</p>
                  <p class="text-sm text-yellow-600 dark:text-yellow-300">+{{ calculatePointsEarned() }} {{ t('rewards.points') }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('booking.transaction_details') }}</div>
              <div class="text-sm space-y-1">
                <div><strong>{{ t('booking.transaction_id') }}:</strong> {{ transactionId }}</div>
                <div><strong>{{ t('booking.amount') }}:</strong> {{ formatCurrency(totalCost) }}</div>
                <div><strong>{{ t('booking.vehicle') }}:</strong> {{ vehicle?.make }} {{ vehicle?.model }}</div>
                <div><strong>{{ t('booking.dates') }}:</strong> {{ booking.start_date }} - {{ booking.end_date }}</div>
              </div>
            </div>
          </div>

          <!-- Failed State -->
          <div v-else-if="paymentStatus === 'failed'" class="mb-6">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('booking.payment_failed') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('booking.payment_failed_desc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Car } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useTranslation } from '../../services/i18n'
import { useRentalsStore } from '../../stores/rentals'
import { useAuthStore } from '../../stores/auth'
import { useRewardsStore } from '../../stores/rewards'
import { useLocaleStore } from '../../stores/locale'
import { useCurrencyConversion } from '../../composables/useCurrencyConversion'
import { bookingApi } from '../../backend/services'
import type { BookingCreateRequest } from '../../backend/types'

// Types
interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  color: string
  price_per_day: number
  images?: string[]
}

interface Booking {
  vehicle_id: number
  start_date: string
  end_date: string
  pickup_location: string
  dropoff_location: string
  notes: string
}

// Route, Router and i18n
const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const rentalsStore = useRentalsStore()
const authStore = useAuthStore()
const rewardsStore = useRewardsStore()
const { formatCurrency } = useCurrencyConversion()

// Debug translation
console.log('Translation test:', t('booking.title'))
console.log('Current language:', useLocaleStore().currentLanguage)

// Reactive data
const vehicle = ref<Vehicle | null>(null)
const loading = ref(true)
const submitting = ref(false)
const showPaymentMethodModal = ref(false)
const showPaymentModal = ref(false)
const showDiscountModal = ref(false)
const paymentStatus = ref<'pending' | 'processing' | 'success' | 'failed'>('pending')
const transactionId = ref('')
const selectedPaymentMethod = ref('')
const booking = ref<Booking>({
  vehicle_id: Number(route.params.vehicleId),
  start_date: '',
  end_date: '',
  pickup_location: '',
  dropoff_location: '',
  notes: ''
})

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const numberOfDays = computed(() => {
  if (!booking.value.start_date || !booking.value.end_date) return 0
  const start = new Date(booking.value.start_date)
  const end = new Date(booking.value.end_date)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})

const totalCost = computed(() => {
  if (!vehicle.value) return 0
  const baseCost = vehicle.value.price_per_day * numberOfDays.value
  return rewardsStore.getDiscountedAmount(baseCost)
})

const originalCost = computed(() => {
  if (!vehicle.value) return 0
  return vehicle.value.price_per_day * numberOfDays.value
})

const discountAmount = computed(() => {
  return originalCost.value - totalCost.value
})

/**
 * Fetch vehicle details
 */
async function fetchVehicle() {
  try {
    loading.value = true
    const response = await api.get(`/vehicles/${route.params.vehicleId}`)
    // Handle new Node.js backend response structure
    vehicle.value = response.data.data?.vehicle || response.data || null
    if (vehicle.value) {
      updateBookingVehicleId(vehicle.value.id)
    }
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    // For demo purposes, show sample data
    vehicle.value = {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      price_per_day: 45000,
      images: ['/placeholder-car.jpg']
    }
    updateBookingVehicleId(vehicle.value.id)
  } finally {
    loading.value = false
  }
}

/**
 * Submit booking - show payment method selection first
 */
async function submitBooking() {
  try {
    submitting.value = true
    showPaymentMethodModal.value = true
  } catch (error) {
    console.error('Error showing payment methods:', error)
  } finally {
    submitting.value = false
  }
}

/**
 * Process payment with selected method
 */
async function processPayment(paymentMethod: string) {
  try {
    selectedPaymentMethod.value = paymentMethod
    showPaymentMethodModal.value = false
    showPaymentModal.value = true
    paymentStatus.value = 'processing'
    
    // Simulate payment process based on selected method
    if (paymentMethod === 'webpay') {
      await simulateTransbankPayment()
    } else {
      await simulateOtherPayment(paymentMethod)
    }
    
    // Create booking after successful payment
    const bookingData: BookingCreateRequest = {
      vehicle_id: booking.value.vehicle_id,
      start_date: booking.value.start_date,
      end_date: booking.value.end_date,
      pickup_location: booking.value.pickup_location,
      return_location: booking.value.dropoff_location,
      pickup_time: '10:00',
      return_time: '10:00',
      total_cost: totalCost.value,
      daily_rate: vehicle.value!.price_per_day,
      number_of_days: numberOfDays.value,
      payment_method: selectedPaymentMethod.value,
      transaction_id: transactionId.value,
      notes: booking.value.notes
    }
    
    // Calculate points earned from rental
    const pointsEarned = calculatePointsEarned()
    
    // Add points to user's rewards
    if (pointsEarned > 0) {
      rewardsStore.userRewards.points += pointsEarned
      console.log(`Earned ${pointsEarned} points for ${numberOfDays.value} day rental`)
    }
    
    // Try to create booking via API
    let createdBooking = null
    try {
      const response = await bookingApi.createBooking(bookingData)
      if (response.success && response.data) {
        createdBooking = response.data
        console.log('Booking created successfully:', createdBooking)
      } else {
        throw new Error(response.message || 'Failed to create booking')
      }
    } catch (apiError) {
      console.log('API not available, using local data')
      // Fallback to local data
      createdBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'confirmed',
        payment_status: 'paid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    
    // Add to rentals store for immediate UI update
    const newRental = {
      id: createdBooking.id,
      vehicle: {
        ...vehicle.value!,
        type: vehicle.value!.color || 'Sedan' // Map color to type for compatibility
      },
      start_date: booking.value.start_date,
      end_date: booking.value.end_date,
      total_cost: totalCost.value,
      status: 'active' as const,
      has_review: false,
      pickup_location: booking.value.pickup_location,
      return_location: booking.value.dropoff_location,
      notes: booking.value.notes,
      vendor_id: vehicle.value?.vendor_id,
      vendor_name: vehicle.value?.vendor?.company_name
    }
    
    // Add to rentals store
    rentalsStore.rentals.push(newRental)
    
    paymentStatus.value = 'success'
    
    // Show success and redirect after delay
    setTimeout(() => {
      showPaymentModal.value = false
      router.push('/my-rentals')
    }, 2000)
    
  } catch (error) {
    console.error('Error creating booking:', error)
    paymentStatus.value = 'failed'
    setTimeout(() => {
      showPaymentModal.value = false
    }, 3000)
  } finally {
    submitting.value = false
  }
}

/**
 * Simulate Transbank Webpay payment process
 */
async function simulateTransbankPayment(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Generate realistic Webpay transaction ID
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    transactionId.value = `TBK${timestamp}${random}`
    
    // Simulate realistic Webpay processing steps
    const steps = [
      { delay: 500, message: 'Connecting to Webpay...' },
      { delay: 800, message: 'Validating payment details...' },
      { delay: 1200, message: 'Processing with Transbank...' },
      { delay: 1000, message: 'Confirming transaction...' }
    ]
    
    let currentStep = 0
    const processStep = () => {
      if (currentStep < steps.length) {
        console.log(`Webpay Step ${currentStep + 1}: ${steps[currentStep].message}`)
        setTimeout(() => {
          currentStep++
          processStep()
        }, steps[currentStep].delay)
      } else {
        // Final processing delay
        setTimeout(() => {
          // 95% success rate for realistic demo
          if (Math.random() > 0.05) {
            console.log(`Webpay Transaction ${transactionId.value} completed successfully`)
            resolve()
          } else {
            console.log(`Webpay Transaction ${transactionId.value} failed`)
            reject(new Error('Webpay payment failed'))
          }
        }, 500)
      }
    }
    
    processStep()
  })
}

/**
 * Simulate other payment methods
 */
async function simulateOtherPayment(paymentMethod: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Generate transaction ID based on payment method
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    switch (paymentMethod) {
      case 'credit_card':
        transactionId.value = `CC${timestamp}${random}`
        break
      case 'debit_card':
        transactionId.value = `DC${timestamp}${random}`
        break
      case 'bank_transfer':
        transactionId.value = `BT${timestamp}${random}`
        break
      default:
        transactionId.value = `PAY${timestamp}${random}`
    }
    
    // Simulate processing delay
    setTimeout(() => {
      if (Math.random() > 0.1) {
        console.log(`Payment ${transactionId.value} completed successfully`)
        resolve()
      } else {
        console.log(`Payment ${transactionId.value} failed`)
        reject(new Error('Payment failed'))
      }
    }, 2000)
  })
}

/**
 * Calculate points earned from rental
 * Base: 40 points per day
 * Multiplier: 0.05 per day for longer rentals
 */
function calculatePointsEarned(): number {
  if (!numberOfDays.value || numberOfDays.value <= 0) return 0
  
  const basePointsPerDay = 40
  const multiplierPerDay = 0.05
  
  // Calculate base points
  const basePoints = numberOfDays.value * basePointsPerDay
  
  // Calculate multiplier bonus (0.05 per day)
  const multiplierBonus = numberOfDays.value * multiplierPerDay
  
  // Total points = base points * (1 + multiplier bonus)
  const totalPoints = Math.floor(basePoints * (1 + multiplierBonus))
  
  return totalPoints
}

/**
 * Apply discount and close modal
 */
function applyDiscountAndClose(discount: any) {
  rewardsStore.toggleDiscount(discount)
  showDiscountModal.value = false
}

// Fix for TypeScript null check
function updateBookingVehicleId(id: number) {
  booking.value.vehicle_id = id
}

// Lifecycle
onMounted(() => {
  fetchVehicle()
})
</script>

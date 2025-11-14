<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ t('booking.discount_code') }}
    </h3>
    
    <div class="space-y-4">
      <!-- Discount Code Input -->
      <div class="flex gap-2">
        <input
          v-model="discountCode"
          type="text"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
          :placeholder="t('booking.enter_discount_code')"
          @keyup.enter="applyDiscount"
        />
        <button
          @click="applyDiscount"
          :disabled="!discountCode.trim() || loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? t('booking.applying') : t('booking.apply') }}
        </button>
      </div>
      
      <!-- Applied Discount -->
      <div v-if="appliedDiscount" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
            <span class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ appliedDiscount.code }}
            </span>
            <span class="text-sm text-green-600 dark:text-green-400">
              {{ appliedDiscount.type === 'percentage' ? appliedDiscount.value + '%' : '$' + appliedDiscount.value }}
            </span>
          </div>
          <button
            @click="removeDiscount"
            class="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          >
            {{ t('booking.remove') }}
          </button>
        </div>
        <p class="text-xs text-green-600 dark:text-green-400 mt-1">
          {{ t('booking.discount_saved') }}: ${{ discountAmount.toLocaleString() }}
        </p>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
        <div class="flex items-center space-x-2">
          <XCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
          <span class="text-sm text-red-800 dark:text-red-200">{{ error }}</span>
        </div>
      </div>
      
      <!-- Available Discounts -->
      <div v-if="availableDiscounts.length > 0" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('booking.available_discounts') }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="discount in availableDiscounts.slice(0, 3)"
            :key="discount.id"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ discount.code }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ discount.type === 'percentage' ? discount.value + '%' : '$' + discount.value }}
              </span>
            </div>
            <button
              @click="applyDiscountCode(discount.code)"
              class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            >
              {{ t('booking.use') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'
import { useUserRewardsStore } from '../../stores/userRewards'
import { useTranslation } from '../../services/i18n'
import type { Discount } from '../../stores/userRewards'

interface Props {
  bookingAmount: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  discountApplied: [discount: Discount, amount: number]
  discountRemoved: []
}>()

const userRewardsStore = useUserRewardsStore()
const { t } = useTranslation()

const discountCode = ref('')
const appliedDiscount = ref<Discount | null>(null)
const availableDiscounts = ref<Discount[]>([])
const loading = ref(false)
const error = ref('')

const discountAmount = computed(() => {
  if (!appliedDiscount.value) return 0
  return userRewardsStore.calculateDiscount(props.bookingAmount)
})

const applyDiscount = async () => {
  if (!discountCode.value.trim()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const discount = await userRewardsStore.applyDiscountCode(discountCode.value.trim())
    appliedDiscount.value = discount
    discountCode.value = ''
    
    emit('discountApplied', discount, discountAmount.value)
  } catch (err: any) {
    error.value = err.message || t('booking.discount_error')
  } finally {
    loading.value = false
  }
}

const applyDiscountCode = async (code: string) => {
  discountCode.value = code
  await applyDiscount()
}

const removeDiscount = async () => {
  try {
    await userRewardsStore.removeActiveDiscount()
    appliedDiscount.value = null
    emit('discountRemoved')
  } catch (err) {
    console.error('Error removing discount:', err)
  }
}

onMounted(async () => {
  // Load available discounts
  await userRewardsStore.fetchDiscounts({ limit: 5 })
  availableDiscounts.value = userRewardsStore.availableDiscounts
  
  // Check if user has an active discount
  if (userRewardsStore.hasActiveDiscount) {
    appliedDiscount.value = userRewardsStore.activeDiscount
    emit('discountApplied', userRewardsStore.activeDiscount!, discountAmount.value)
  }
})
</script>


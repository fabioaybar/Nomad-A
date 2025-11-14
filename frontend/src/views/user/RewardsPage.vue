<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ t('rewards.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t('rewards.subtitle') }}
        </p>
      </div>

      <!-- User Rewards Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Points & Tier Card -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('rewards.your_points') }}
              </h2>
              <div class="flex items-center space-x-4">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ userRewardsStore.userRewards.points.toLocaleString() }}
                </div>
                <div class="flex items-center space-x-2">
                  <div 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="userRewardsStore.tierInfo.bgColor + ' ' + userRewardsStore.tierInfo.color"
                  >
                    {{ userRewardsStore.tierInfo.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('rewards.total_earned') }}</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ userRewardsStore.userRewards.totalEarned.toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Progress to Next Tier -->
          <div v-if="userRewardsStore.userRewards.pointsToNext > 0" class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('rewards.progress_to_next') }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ userRewardsStore.userRewards.pointsToNext.toLocaleString() }} {{ t('rewards.points_to_go') }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: userRewardsStore.progressToNextTier + '%' }"
              ></div>
            </div>
          </div>

          <!-- Tier Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ t('rewards.tier_benefits') }}</h3>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li v-for="benefit in getTierBenefits(userRewardsStore.userRewards.tier)" :key="benefit">
                  • {{ benefit }}
                </li>
              </ul>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ t('rewards.earn_points') }}</h3>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• {{ t('rewards.earn_methods.booking') }}</li>
                <li>• {{ t('rewards.earn_methods.review') }}</li>
                <li>• {{ t('rewards.earn_methods.referral') }}</li>
                <li>• {{ t('rewards.earn_methods.special') }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Active Discount Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('rewards.active_discount') }}
          </h2>
          
          <div v-if="userRewardsStore.hasActiveDiscount" class="space-y-4">
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-green-900 dark:text-green-100">
                  {{ userRewardsStore.activeDiscount?.code }}
                </span>
                <span class="text-sm text-green-700 dark:text-green-300">
                  {{ userRewardsStore.activeDiscount?.type === 'percentage' ? userRewardsStore.activeDiscount?.value + '%' : '$' + userRewardsStore.activeDiscount?.value }}
                </span>
              </div>
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ userRewardsStore.activeDiscount?.vendor?.company_name }}
              </p>
              <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                {{ t('rewards.expires') }}: {{ formatDate(userRewardsStore.activeDiscount?.end_date) }}
              </p>
            </div>
            <button
              @click="removeActiveDiscount"
              class="w-full btn-secondary text-sm"
            >
              {{ t('rewards.remove_discount') }}
            </button>
          </div>
          
          <div v-else class="text-center py-8">
            <Gift class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('rewards.no_active_discount') }}</p>
            <button
              @click="showDiscountModal = true"
              class="btn-primary text-sm"
            >
              {{ t('rewards.apply_code') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              <component :is="tab.icon" class="w-4 h-4 inline mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Rewards Tab -->
      <div v-if="activeTab === 'rewards'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('rewards.available_rewards') }}</h3>
          </div>
          
          <div v-if="userRewardsStore.loading" class="p-8 text-center">
            <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
            <p class="text-gray-500 dark:text-gray-400">{{ t('rewards.loading') }}</p>
          </div>

          <div v-else-if="userRewardsStore.rewards.length === 0" class="p-8 text-center">
            <Gift class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ t('rewards.no_rewards') }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ t('rewards.no_rewards_desc') }}
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="reward in userRewardsStore.rewards"
              :key="reward.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ reward.title }}
                    </h4>
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="reward.is_redeemed ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'"
                    >
                      {{ reward.is_redeemed ? t('rewards.redeemed') : t('rewards.available') }}
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 mb-3">{{ reward.description }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ t('rewards.vendor') }}: {{ reward.vendor?.company_name }}</span>
                    <span v-if="reward.points_required > 0">{{ t('rewards.cost') }}: {{ reward.points_required }} {{ t('rewards.points') }}</span>
                  </div>
                </div>
                <div class="ml-6">
                  <button
                    v-if="!reward.is_redeemed && (reward.points_required === 0 || userRewardsStore.userRewards.points >= reward.points_required)"
                    @click="redeemReward(reward.id)"
                    class="btn-primary text-sm"
                    :disabled="userRewardsStore.loading"
                  >
                    {{ t('rewards.redeem') }}
                  </button>
                  <span
                    v-else-if="reward.points_required > 0 && userRewardsStore.userRewards.points < reward.points_required"
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ t('rewards.need_points') }}: {{ reward.points_required - userRewardsStore.userRewards.points }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discounts Tab -->
      <div v-if="activeTab === 'discounts'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('rewards.available_discounts') }}</h3>
              <button
                @click="showDiscountModal = true"
                class="btn-secondary text-sm"
              >
                {{ t('rewards.apply_code') }}
              </button>
            </div>
          </div>
          
          <div v-if="userRewardsStore.loading" class="p-8 text-center">
            <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
            <p class="text-gray-500 dark:text-gray-400">{{ t('rewards.loading') }}</p>
          </div>

          <div v-else-if="userRewardsStore.availableDiscounts.length === 0" class="p-8 text-center">
            <Tag class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ t('rewards.no_discounts') }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ t('rewards.no_discounts_desc') }}
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="discount in userRewardsStore.availableDiscounts"
              :key="discount.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ discount.code }}
                    </h4>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                      {{ discount.type === 'percentage' ? discount.value + '%' : '$' + discount.value.toLocaleString() }}
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 mb-3">{{ discount.vendor?.company_name }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span v-if="discount.min_amount">{{ t('rewards.min_amount') }}: ${{ discount.min_amount.toLocaleString() }}</span>
                    <span>{{ t('rewards.expires') }}: {{ formatDate(discount.end_date) }}</span>
                    <span>{{ t('rewards.usage') }}: {{ discount.usage_count }}/{{ discount.usage_limit || '∞' }}</span>
                  </div>
                </div>
                <div class="ml-6">
                  <button
                    @click="applyDiscountCode(discount.code)"
                    class="btn-primary text-sm"
                    :disabled="userRewardsStore.loading"
                  >
                    {{ t('rewards.apply') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discount Code Modal -->
      <div v-if="showDiscountModal" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="showDiscountModal = false"></div>
        <div class="relative max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('rewards.apply_discount_code') }}</h3>
          <form @submit.prevent="applyDiscountCode(discountCode)" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{{ t('rewards.discount_code') }}</label>
              <input 
                v-model="discountCode"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                :placeholder="t('rewards.enter_code')"
                required
              />
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" @click="showDiscountModal = false" class="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
                {{ t('rewards.cancel') }}
              </button>
              <button type="submit" class="btn-primary" :disabled="!discountCode.trim()">
                {{ t('rewards.apply') }}
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
import { 
  Gift, 
  Tag, 
  Star,
  Percent
} from 'lucide-vue-next'
import { useUserRewardsStore } from '../../stores/userRewards'
import { useTranslation } from '../../services/i18n'

const userRewardsStore = useUserRewardsStore()
const { t } = useTranslation()

// State
const activeTab = ref('rewards')
const showDiscountModal = ref(false)
const discountCode = ref('')

// Tabs
const tabs = [
  {
    key: 'rewards',
    label: t('rewards.rewards'),
    icon: Gift
  },
  {
    key: 'discounts',
    label: t('rewards.discounts'),
    icon: Tag
  }
]

// Methods
const getTierBenefits = (tier: string) => {
  const benefits = {
    bronze: [
      t('rewards.benefits.bronze.points'),
      t('rewards.benefits.bronze.support')
    ],
    silver: [
      t('rewards.benefits.silver.points'),
      t('rewards.benefits.silver.priority'),
      t('rewards.benefits.silver.discounts')
    ],
    gold: [
      t('rewards.benefits.gold.points'),
      t('rewards.benefits.gold.priority'),
      t('rewards.benefits.gold.exclusive'),
      t('rewards.benefits.gold.upgrades')
    ],
    platinum: [
      t('rewards.benefits.platinum.points'),
      t('rewards.benefits.platinum.priority'),
      t('rewards.benefits.platinum.exclusive'),
      t('rewards.benefits.platinum.upgrades'),
      t('rewards.benefits.platinum.concierge')
    ]
  }
  return benefits[tier as keyof typeof benefits] || []
}

const applyDiscountCode = async (code: string) => {
  try {
    await userRewardsStore.applyDiscountCode(code)
    showDiscountModal.value = false
    discountCode.value = ''
  } catch (error) {
    // Error handling is done in the store
  }
}

const removeActiveDiscount = async () => {
  try {
    await userRewardsStore.removeActiveDiscount()
  } catch (error) {
    // Error handling is done in the store
  }
}

const redeemReward = async (rewardId: number) => {
  try {
    await userRewardsStore.redeemReward(rewardId)
  } catch (error) {
    // Error handling is done in the store
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    userRewardsStore.fetchUserRewards(),
    userRewardsStore.fetchRewards(),
    userRewardsStore.fetchDiscounts()
  ])
})
</script>


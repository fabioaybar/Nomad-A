<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.rewards.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.rewards.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="configureRewards"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings class="w-5 h-5 mr-2" />
              {{ t('admin.rewards.configure') }}
            </button>
            <button
              @click="refreshData"
              class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw class="w-5 h-5 mr-2" />
              {{ t('admin.rewards.refresh') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Star class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.rewards.total_points_issued') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalPointsIssued.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.rewards.active_users') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.activeUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Gift class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.rewards.discounts_used') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.discountsUsed }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.rewards.total_savings') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">${{ stats.totalSavings.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Points Issued Over Time -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards.points_over_time') }}</h3>
            <select
              v-model="pointsChartPeriod"
              @change="updatePointsChart"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="week">{{ t('admin.rewards.this_week') }}</option>
              <option value="month">{{ t('admin.rewards.this_month') }}</option>
              <option value="year">{{ t('admin.rewards.this_year') }}</option>
            </select>
          </div>
          <div class="h-64 flex items-center justify-center">
            <img 
              :src="pointsChartUrl" 
              :alt="t('admin.rewards.points_chart')"
              class="max-w-full max-h-full"
              @error="handleChartError"
            />
          </div>
        </div>

        <!-- Tier Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('admin.rewards.tier_distribution') }}</h3>
          <div class="h-64 flex items-center justify-center">
            <img 
              :src="tierChartUrl" 
              :alt="t('admin.rewards.tier_chart')"
              class="max-w-full max-h-full"
              @error="handleChartError"
            />
          </div>
        </div>
      </div>

      <!-- Top Users and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top Users by Points -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards.top_users') }}</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="(user, index) in topUsers"
                :key="user.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <User class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user.points.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ t(`admin.rewards.${user.tier}_tier`) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards.recent_activity') }}</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <Star class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="flex-1">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ activity.description }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(activity.date) }}</div>
                </div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ activity.points > 0 ? '+' : '' }}{{ activity.points }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Management Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards.manual_management') }}</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Adjust Points -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t('admin.rewards.adjust_points') }}</h4>
              <div class="space-y-3">
                <input
                  v-model="adjustPointsForm.userEmail"
                  type="email"
                  :placeholder="t('admin.rewards.user_email')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <input
                  v-model.number="adjustPointsForm.points"
                  type="number"
                  :placeholder="t('admin.rewards.points_amount')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <textarea
                  v-model="adjustPointsForm.reason"
                  :placeholder="t('admin.rewards.reason')"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
                <button
                  @click="adjustPoints"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {{ t('admin.rewards.adjust') }}
                </button>
              </div>
            </div>

            <!-- Issue Bonus -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t('admin.rewards.issue_bonus') }}</h4>
              <div class="space-y-3">
                <select
                  v-model="bonusForm.tier"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">{{ t('admin.rewards.select_tier') }}</option>
                  <option value="bronze">{{ t('admin.rewards.bronze_tier') }}</option>
                  <option value="silver">{{ t('admin.rewards.silver_tier') }}</option>
                  <option value="gold">{{ t('admin.rewards.gold_tier') }}</option>
                  <option value="platinum">{{ t('admin.rewards.platinum_tier') }}</option>
                </select>
                <input
                  v-model.number="bonusForm.points"
                  type="number"
                  :placeholder="t('admin.rewards.bonus_points')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <textarea
                  v-model="bonusForm.message"
                  :placeholder="t('admin.rewards.bonus_message')"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
                <button
                  @click="issueBonus"
                  class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {{ t('admin.rewards.issue') }}
                </button>
              </div>
            </div>

            <!-- Account Actions -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t('admin.rewards.account_actions') }}</h4>
              <div class="space-y-3">
                <input
                  v-model="accountForm.userEmail"
                  type="email"
                  :placeholder="t('admin.rewards.user_email')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <div class="flex space-x-2">
                  <button
                    @click="freezeAccount"
                    class="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    {{ t('admin.rewards.freeze') }}
                  </button>
                  <button
                    @click="unfreezeAccount"
                    class="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    {{ t('admin.rewards.unfreeze') }}
                  </button>
                </div>
                <button
                  @click="resetPoints"
                  class="w-full px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                >
                  {{ t('admin.rewards.reset_points') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rewards Configuration Modal -->
    <div v-if="showConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards.configure') }}</h3>
            <button
              @click="cancelConfig"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Tier Requirements -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t('admin.rewards.tier_requirements') }}</h4>
              <div class="space-y-4">
                <div v-for="(tier, tierName) in rewardsConfig" :key="tierName" v-if="typeof tier === 'object' && tier.minPoints !== undefined" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ t(`admin.rewards.${tierName}_tier`) }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.min_points') }}</label>
                      <input
                        v-model.number="rewardsConfig[tierName].minPoints"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.max_points') }}</label>
                      <input
                        v-model.number="rewardsConfig[tierName].maxPoints"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.discount_percent') }}</label>
                      <input
                        v-model.number="rewardsConfig[tierName].discountPercent"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Earning Rules -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t('admin.rewards.earning_rules') }}</h4>
              <div class="space-y-3">
                <div v-for="(points, rule) in rewardsConfig.earningRules" :key="rule" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ t(`admin.rewards.${rule}`) }}</span>
                  <input
                    v-model.number="rewardsConfig.earningRules[rule]"
                    type="number"
                    min="0"
                    class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Expiration Settings -->
          <div class="mt-8">
            <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t('admin.rewards.expiration_settings') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.points_expire_months') }}</label>
                <input
                  v-model.number="rewardsConfig.expiration.pointsExpireMonths"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.tier_downgrade_months') }}</label>
                <input
                  v-model.number="rewardsConfig.expiration.tierDowngradeMonths"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.grace_period_days') }}</label>
                <input
                  v-model.number="rewardsConfig.expiration.gracePeriodDays"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <!-- Campaign Settings -->
          <div class="mt-8">
            <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t('admin.rewards.campaign_settings') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.new_user_bonus') }}</label>
                <input
                  v-model.number="rewardsConfig.campaigns.newUserBonus"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.first_rental_bonus') }}</label>
                <input
                  v-model.number="rewardsConfig.campaigns.firstRentalBonus"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.rewards.loyalty_multiplier') }}</label>
                <input
                  v-model.number="rewardsConfig.campaigns.loyaltyMultiplier"
                  type="number"
                  min="1"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            @click="cancelConfig"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('admin.rewards.cancel') }}
          </button>
          <button
            @click="saveRewardsConfig"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ t('admin.rewards.save_config') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTranslation } from '../../../services/i18n'
import { 
  Star, Users, Gift, TrendingUp, Settings, RefreshCw, User, X
} from 'lucide-vue-next'
import { generateChartUrl, createRevenueChart, createPieChart, generateSampleData } from '../../../services/quickchart'

const { t } = useTranslation()

// Types
interface User {
  id: string
  name: string
  email: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface Activity {
  id: string
  description: string
  points: number
  date: Date
}

// State
const pointsChartPeriod = ref('month')
const showConfigModal = ref(false)
const adjustPointsForm = ref({
  userEmail: '',
  points: 0,
  reason: ''
})
const bonusForm = ref({
  tier: '',
  points: 0,
  message: ''
})
const accountForm = ref({
  userEmail: ''
})

// Rewards Configuration
const rewardsConfig = ref({
  // Tier Requirements
  bronze: { minPoints: 0, maxPoints: 499, discountPercent: 5 },
  silver: { minPoints: 500, maxPoints: 1499, discountPercent: 10 },
  gold: { minPoints: 1500, maxPoints: 2999, discountPercent: 15 },
  platinum: { minPoints: 3000, maxPoints: 999999, discountPercent: 20 },
  
  // Earning Rules
  earningRules: {
    rentalCompletion: 100,
    referral: 150,
    review: 25,
    socialShare: 10,
    birthday: 200,
    anniversary: 100
  },
  
  // Expiration Settings
  expiration: {
    pointsExpireMonths: 12,
    tierDowngradeMonths: 6,
    gracePeriodDays: 30
  },
  
  // Campaign Settings
  campaigns: {
    newUserBonus: 100,
    firstRentalBonus: 50,
    loyaltyMultiplier: 1.5
  }
})

// Mock data
const mockStats = {
  totalPointsIssued: 125000,
  activeUsers: 18,
  discountsUsed: 45,
  totalSavings: 12500
}

const mockTopUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john@email.com', points: 2500, tier: 'gold' },
  { id: '2', name: 'Maria Garcia', email: 'maria@email.com', points: 1800, tier: 'silver' },
  { id: '3', name: 'David Johnson', email: 'david@email.com', points: 3200, tier: 'platinum' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@email.com', points: 1200, tier: 'silver' },
  { id: '5', name: 'Michael Brown', email: 'michael@email.com', points: 800, tier: 'bronze' }
]

const mockRecentActivity: Activity[] = [
  { id: '1', description: 'Points earned from rental completion', points: 100, date: new Date('2025-01-08') },
  { id: '2', description: 'Bonus points for loyalty program', points: 50, date: new Date('2025-01-07') },
  { id: '3', description: 'Discount applied to booking', points: -200, date: new Date('2025-01-06') },
  { id: '4', description: 'Points earned from referral', points: 150, date: new Date('2025-01-05') },
  { id: '5', description: 'Manual adjustment by admin', points: 75, date: new Date('2025-01-04') }
]

// Computed
const stats = computed(() => mockStats)
const topUsers = computed(() => mockTopUsers)
const recentActivity = computed(() => mockRecentActivity)

// Chart URLs
const pointsChartUrl = computed(() => {
  const sampleData = generateSampleData(pointsChartPeriod.value)
  const chartConfig = createRevenueChart(sampleData.labels, sampleData.data, 'Points Issued')
  return generateChartUrl(chartConfig, { width: 400, height: 200 })
})

const tierChartUrl = computed(() => {
  const chartConfig = createPieChart(
    ['Bronze', 'Silver', 'Gold', 'Platinum'],
    [45, 30, 20, 5],
    'Tier Distribution'
  )
  return generateChartUrl(chartConfig, { width: 400, height: 200 })
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const updatePointsChart = () => {
  // Chart will automatically update due to computed property
}

const handleChartError = () => {
  console.error('Chart failed to load')
}

const configureRewards = () => {
  showConfigModal.value = true
}

const refreshData = () => {
  alert('Data refreshed!')
}

const adjustPoints = () => {
  if (!adjustPointsForm.value.userEmail || !adjustPointsForm.value.points) {
    alert('Please fill in all required fields')
    return
  }
  
  alert(`Points adjusted for ${adjustPointsForm.value.userEmail}: ${adjustPointsForm.value.points}`)
  adjustPointsForm.value = { userEmail: '', points: 0, reason: '' }
}

const issueBonus = () => {
  if (!bonusForm.value.tier || !bonusForm.value.points) {
    alert('Please fill in all required fields')
    return
  }
  
  alert(`Bonus issued to ${bonusForm.value.tier} tier: ${bonusForm.value.points} points`)
  bonusForm.value = { tier: '', points: 0, message: '' }
}

const freezeAccount = () => {
  if (!accountForm.value.userEmail) {
    alert('Please enter user email')
    return
  }
  
  alert(`Account frozen for ${accountForm.value.userEmail}`)
}

const unfreezeAccount = () => {
  if (!accountForm.value.userEmail) {
    alert('Please enter user email')
    return
  }
  
  alert(`Account unfrozen for ${accountForm.value.userEmail}`)
}

const resetPoints = () => {
  if (!accountForm.value.userEmail) {
    alert('Please enter user email')
    return
  }
  
  if (confirm(`Are you sure you want to reset points for ${accountForm.value.userEmail}?`)) {
    alert(`Points reset for ${accountForm.value.userEmail}`)
  }
}

const saveRewardsConfig = () => {
  alert('Rewards configuration saved successfully!')
  showConfigModal.value = false
}

const cancelConfig = () => {
  showConfigModal.value = false
}

// Load data on mount
onMounted(() => {
  // Data is already loaded via computed properties
})
</script>

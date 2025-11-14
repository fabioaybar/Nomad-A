import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notifications'

export interface Discount {
  id: number
  vendor_id: number
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_amount?: number
  max_discount?: number
  usage_limit?: number
  usage_count: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
  vendor?: {
    id: number
    company_name: string
  }
}

export interface Reward {
  id: number
  user_id: number
  vendor_id: number
  type: 'points' | 'discount' | 'free_rental' | 'upgrade'
  title: string
  description: string
  value: number
  points_required: number
  is_active: boolean
  is_redeemed: boolean
  redeemed_at?: string
  expiry_date?: string
  created_at: string
  updated_at: string
  vendor?: {
    id: number
    company_name: string
  }
}

export interface UserRewards {
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextTier: string
  pointsToNext: number
  totalEarned: number
  totalSpent: number
  activeDiscount?: Discount
}

export const useUserRewardsStore = defineStore('userRewards', () => {
  const userRewards = ref<UserRewards>({
    points: 0,
    tier: 'bronze',
    nextTier: 'silver',
    pointsToNext: 1000,
    totalEarned: 0,
    totalSpent: 0
  })
  
  const rewards = ref<Reward[]>([])
  const availableDiscounts = ref<Discount[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  
  // Computed properties
  const activeDiscount = computed(() => userRewards.value.activeDiscount)
  const hasActiveDiscount = computed(() => !!userRewards.value.activeDiscount)
  
  const tierInfo = computed(() => {
    const tiers = {
      bronze: { name: 'Bronze', minPoints: 0, color: 'text-amber-600', bgColor: 'bg-amber-100' },
      silver: { name: 'Silver', minPoints: 1000, color: 'text-gray-600', bgColor: 'bg-gray-100' },
      gold: { name: 'Gold', minPoints: 2500, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      platinum: { name: 'Platinum', minPoints: 5000, color: 'text-purple-600', bgColor: 'bg-purple-100' }
    }
    return tiers[userRewards.value.tier as keyof typeof tiers]
  })
  
  const progressToNextTier = computed(() => {
    const currentTierPoints = tierInfo.value.minPoints
    const nextTierPoints = getNextTierPoints(userRewards.value.tier)
    const progress = ((userRewards.value.points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100
    return Math.min(Math.max(progress, 0), 100)
  })
  
  // Methods
  const getNextTierPoints = (currentTier: string) => {
    const tierPoints = {
      bronze: 1000,
      silver: 2500,
      gold: 5000,
      platinum: 10000
    }
    return tierPoints[currentTier as keyof typeof tierPoints] || 10000
  }
  
  const updateTier = () => {
    if (userRewards.value.points >= 5000) {
      userRewards.value.tier = 'platinum'
      userRewards.value.nextTier = 'platinum'
      userRewards.value.pointsToNext = 0
    } else if (userRewards.value.points >= 2500) {
      userRewards.value.tier = 'gold'
      userRewards.value.nextTier = 'platinum'
      userRewards.value.pointsToNext = 5000 - userRewards.value.points
    } else if (userRewards.value.points >= 1000) {
      userRewards.value.tier = 'silver'
      userRewards.value.nextTier = 'gold'
      userRewards.value.pointsToNext = 2500 - userRewards.value.points
    } else {
      userRewards.value.tier = 'bronze'
      userRewards.value.nextTier = 'silver'
      userRewards.value.pointsToNext = 1000 - userRewards.value.points
    }
  }
  
  // Fetch user rewards from API
  const fetchUserRewards = async () => {
    if (!authStore.isAuthenticated) return
    
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/users/rewards')
      
      if (response.data.success) {
        userRewards.value = {
          ...userRewards.value,
          ...response.data.data.rewards
        }
        updateTier()
      } else {
        throw new Error(response.data.message || 'Failed to fetch user rewards')
      }
    } catch (err: any) {
      console.error('Error fetching user rewards:', err)
      error.value = err.message || 'Failed to fetch user rewards'
      
      // Fallback to mock data for development
      if (err.status === 401) throw err
      loadMockUserRewards()
    } finally {
      loading.value = false
    }
  }
  
  // Fetch available rewards
  const fetchRewards = async (params?: {
    page?: number
    limit?: number
    type?: string
    vendor_id?: number
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.type) queryParams.set('type', params.type)
      if (params?.vendor_id) queryParams.set('vendor_id', params.vendor_id.toString())
      
      const response = await api.get(`/rewards?${queryParams.toString()}`)
      
      if (response.data.success) {
        rewards.value = response.data.data.rewards || []
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch rewards')
      }
    } catch (err: any) {
      console.error('Error fetching rewards:', err)
      error.value = err.message || 'Failed to fetch rewards'
      
      // Fallback to mock data for development
      if (err.status === 401) throw err
      loadMockRewards()
    } finally {
      loading.value = false
    }
  }
  
  // Fetch available discounts
  const fetchDiscounts = async (params?: {
    page?: number
    limit?: number
    type?: string
    vendor_id?: number
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.type) queryParams.set('type', params.type)
      if (params?.vendor_id) queryParams.set('vendor_id', params.vendor_id.toString())
      
      const response = await api.get(`/discounts?${queryParams.toString()}`)
      
      if (response.data.success) {
        availableDiscounts.value = response.data.data.discounts || []
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch discounts')
      }
    } catch (err: any) {
      console.error('Error fetching discounts:', err)
      error.value = err.message || 'Failed to fetch discounts'
      
      // Fallback to mock data for development
      if (err.status === 401) throw err
      loadMockDiscounts()
    } finally {
      loading.value = false
    }
  }
  
  // Apply discount code
  const applyDiscountCode = async (code: string) => {
    try {
      const response = await api.post('/discounts/apply', { code })
      
      if (response.data.success) {
        const discount = response.data.data.discount
        userRewards.value.activeDiscount = discount
        
        notificationStore.addNotification({
          type: 'success',
          title: 'Discount Applied',
          message: `Discount code "${code}" has been applied successfully!`
        })
        
        return discount
      } else {
        throw new Error(response.data.message || 'Failed to apply discount code')
      }
    } catch (err: any) {
      console.error('Error applying discount code:', err)
      
      notificationStore.addNotification({
        type: 'error',
        title: 'Discount Failed',
        message: err.message || 'Invalid or expired discount code'
      })
      
      throw err
    }
  }
  
  // Remove active discount
  const removeActiveDiscount = async () => {
    try {
      if (userRewards.value.activeDiscount) {
        const response = await api.delete('/discounts/remove')
        
        if (response.data.success) {
          userRewards.value.activeDiscount = undefined
          
          notificationStore.addNotification({
            type: 'success',
            title: 'Discount Removed',
            message: 'Active discount has been removed'
          })
        }
      }
    } catch (err: any) {
      console.error('Error removing discount:', err)
      
      // Fallback to local update
      userRewards.value.activeDiscount = undefined
    }
  }
  
  // Redeem reward
  const redeemReward = async (rewardId: number) => {
    try {
      const response = await api.post(`/rewards/${rewardId}/redeem`)
      
      if (response.data.success) {
        const reward = response.data.data.reward
        
        // Update local rewards list
        const index = rewards.value.findIndex(r => r.id === rewardId)
        if (index > -1) {
          rewards.value[index] = reward
        }
        
        notificationStore.addNotification({
          type: 'success',
          title: 'Reward Redeemed',
          message: `You have successfully redeemed "${reward.title}"!`
        })
        
        return reward
      } else {
        throw new Error(response.data.message || 'Failed to redeem reward')
      }
    } catch (err: any) {
      console.error('Error redeeming reward:', err)
      
      notificationStore.addNotification({
        type: 'error',
        title: 'Redemption Failed',
        message: err.message || 'Failed to redeem reward'
      })
      
      throw err
    }
  }
  
  // Calculate discount amount
  const calculateDiscount = (amount: number): number => {
    if (!userRewards.value.activeDiscount) return 0
    
    const discount = userRewards.value.activeDiscount
    let discountAmount = 0
    
    if (discount.type === 'percentage') {
      discountAmount = (amount * discount.value) / 100
    } else {
      discountAmount = discount.value
    }
    
    // Apply maximum discount limit if set
    if (discount.max_discount) {
      discountAmount = Math.min(discountAmount, discount.max_discount)
    }
    
    // Don't discount more than the total amount
    return Math.min(discountAmount, amount)
  }
  
  // Get discounted amount
  const getDiscountedAmount = (amount: number): number => {
    return amount - calculateDiscount(amount)
  }
  
  // Validate discount code
  const validateDiscountCode = async (code: string) => {
    try {
      const response = await api.post('/discounts/validate', { code })
      
      if (response.data.success) {
        return response.data.data.discount
      } else {
        return null
      }
    } catch (err: any) {
      console.error('Error validating discount code:', err)
      return null
    }
  }
  
  // Mock data for development
  const loadMockUserRewards = () => {
    userRewards.value = {
      points: 1250,
      tier: 'silver',
      nextTier: 'gold',
      pointsToNext: 1250,
      totalEarned: 2500,
      totalSpent: 1250
    }
  }
  
  const loadMockRewards = () => {
    rewards.value = [
      {
        id: 1,
        user_id: 1,
        vendor_id: 1,
        type: 'points',
        title: 'Welcome Bonus',
        description: 'Earn 100 bonus points for your first rental',
        value: 100,
        points_required: 0,
        is_active: true,
        is_redeemed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vendor: {
          id: 1,
          company_name: 'AutoRent Chile'
        }
      },
      {
        id: 2,
        user_id: 1,
        vendor_id: 1,
        type: 'discount',
        title: '5% Off Next Rental',
        description: 'Get 5% discount on your next vehicle rental',
        value: 5,
        points_required: 500,
        is_active: true,
        is_redeemed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vendor: {
          id: 1,
          company_name: 'AutoRent Chile'
        }
      }
    ]
  }
  
  const loadMockDiscounts = () => {
    availableDiscounts.value = [
      {
        id: 1,
        vendor_id: 1,
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        min_amount: 50000,
        usage_limit: 100,
        usage_count: 45,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vendor: {
          id: 1,
          company_name: 'AutoRent Chile'
        }
      },
      {
        id: 2,
        vendor_id: 2,
        code: 'SAVE20',
        type: 'fixed',
        value: 20000,
        min_amount: 100000,
        usage_limit: 50,
        usage_count: 12,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vendor: {
          id: 2,
          company_name: 'Premium Cars'
        }
      }
    ]
  }
  
  // Initialize with mock data if not authenticated
  const initialize = () => {
    if (!authStore.isAuthenticated) {
      loadMockUserRewards()
      loadMockRewards()
      loadMockDiscounts()
    }
  }
  
  return {
    // State
    userRewards,
    rewards,
    availableDiscounts,
    loading,
    error,
    
    // Computed
    activeDiscount,
    hasActiveDiscount,
    tierInfo,
    progressToNextTier,
    
    // Actions
    fetchUserRewards,
    fetchRewards,
    fetchDiscounts,
    applyDiscountCode,
    removeActiveDiscount,
    redeemReward,
    calculateDiscount,
    getDiscountedAmount,
    validateDiscountCode,
    initialize
  }
})


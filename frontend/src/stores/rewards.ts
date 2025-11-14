import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Discount {
  id: number
  name: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  pointsRequired: number
  isActive?: boolean
}

export interface UserRewards {
  points: number
  tier: string
  nextTier: string
  pointsToNext: number
  activeDiscount?: Discount
}

export const useRewardsStore = defineStore('rewards', () => {
  // Load from localStorage or use defaults
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('userRewards')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading rewards from storage:', error)
    }
    return {
      points: 1250,
      tier: 'silver',
      nextTier: 'gold',
      pointsToNext: 750,
      activeDiscount: undefined
    }
  }

  const userRewards = ref<UserRewards>(loadFromStorage())

  // Available discounts
  const availableDiscounts = ref<Discount[]>([
    {
      id: 1,
      name: '5% Off Next Rental',
      description: 'Get 5% discount on your next vehicle rental',
      type: 'percentage',
      value: 5,
      pointsRequired: 500
    },
    {
      id: 2,
      name: '$10 Off Weekend Rental',
      description: 'Save $10 on any weekend rental',
      type: 'fixed',
      value: 10,
      pointsRequired: 800
    },
    {
      id: 3,
      name: '15% Off Premium Vehicles',
      description: 'Get 15% discount on premium vehicle rentals',
      type: 'percentage',
      value: 15,
      pointsRequired: 1200
    },
    {
      id: 4,
      name: '$25 Off Long-term Rental',
      description: 'Save $25 on rentals longer than 7 days',
      type: 'fixed',
      value: 25,
      pointsRequired: 1500
    }
  ])

  // Computed properties
  const activeDiscount = computed(() => userRewards.value.activeDiscount)
  const hasActiveDiscount = computed(() => !!userRewards.value.activeDiscount)

  // Save to localStorage whenever rewards change
  const saveToStorage = () => {
    try {
      localStorage.setItem('userRewards', JSON.stringify(userRewards.value))
    } catch (error) {
      console.error('Error saving rewards to storage:', error)
    }
  }

  // Actions
  const toggleDiscount = (discount: Discount) => {
    if (discount.isActive) {
      // Deactivate current discount
      discount.isActive = false
      userRewards.value.activeDiscount = undefined
      userRewards.value.points += discount.pointsRequired // Refund points
    } else {
      // Deactivate any currently active discount first
      if (userRewards.value.activeDiscount) {
        const currentActive = availableDiscounts.value.find(d => d.id === userRewards.value.activeDiscount?.id)
        if (currentActive) {
          currentActive.isActive = false
          userRewards.value.points += userRewards.value.activeDiscount.pointsRequired
        }
      }
      
      // Activate new discount
      if (userRewards.value.points >= discount.pointsRequired) {
        discount.isActive = true
        userRewards.value.activeDiscount = discount
        userRewards.value.points -= discount.pointsRequired
      }
    }
    
    // Save to localStorage
    saveToStorage()
  }

  const clearActiveDiscount = () => {
    if (userRewards.value.activeDiscount) {
      const currentActive = availableDiscounts.value.find(d => d.id === userRewards.value.activeDiscount?.id)
      if (currentActive) {
        currentActive.isActive = false
        userRewards.value.points += userRewards.value.activeDiscount.pointsRequired
      }
      userRewards.value.activeDiscount = undefined
      saveToStorage()
    }
  }

  const calculateDiscount = (amount: number): number => {
    if (!userRewards.value.activeDiscount) return 0
    
    const discount = userRewards.value.activeDiscount
    if (discount.type === 'percentage') {
      return (amount * discount.value) / 100
    } else {
      return Math.min(discount.value, amount) // Don't discount more than the total
    }
  }

  const getDiscountedAmount = (amount: number): number => {
    return amount - calculateDiscount(amount)
  }

  return {
    userRewards,
    availableDiscounts,
    activeDiscount,
    hasActiveDiscount,
    toggleDiscount,
    clearActiveDiscount,
    calculateDiscount,
    getDiscountedAmount
  }
})

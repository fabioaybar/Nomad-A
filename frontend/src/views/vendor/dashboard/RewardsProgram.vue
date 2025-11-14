<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rewards Program</h2>
        <p class="text-gray-600 dark:text-gray-400">Configure loyalty tiers and track customer points.</p>
      </div>

      <!-- Tier configuration -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tiers</h3>
        <div class="space-y-4">
          <div v-for="(tier, idx) in tiers" :key="tier.id" class="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input v-model.trim="tier.name" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Min Points</label>
              <input v-model.number="tier.min" type="number" min="0" step="1" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Multiplier</label>
              <input v-model.number="tier.multiplier" type="number" min="1" step="0.1" class="input-field" />
            </div>
            <div class="flex gap-2">
              <button @click="removeTier(idx)" class="px-3 py-2 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30">Remove</button>
            </div>
          </div>
          <div>
            <button @click="addTier" class="btn-primary">Add Tier</button>
          </div>
        </div>
      </div>

      <!-- Sample customers table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customers</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="c in customers" :key="c.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ c.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">{{ c.points }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">{{ computeTier(c.points) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div class="inline-flex gap-2">
                    <button @click="adjustPoints(c, 100)" class="px-3 py-1 rounded-md border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30">+100</button>
                    <button @click="adjustPoints(c, -100)" class="px-3 py-1 rounded-md border border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30">-100</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tier { id: number; name: string; min: number; multiplier: number }
interface Customer { id: number; name: string; points: number }

const tiers = ref<Tier[]>([
  { id: 1, name: 'Bronze', min: 0, multiplier: 1 },
  { id: 2, name: 'Silver', min: 1000, multiplier: 1.1 },
  { id: 3, name: 'Gold', min: 5000, multiplier: 1.25 },
])

const customers = ref<Customer[]>([
  { id: 1, name: 'John Doe', points: 1200 },
  { id: 2, name: 'Jane Smith', points: 5200 },
])

const addTier = () => {
  const nextId = Math.max(0, ...tiers.value.map(t => t.id)) + 1
  tiers.value.push({ id: nextId, name: 'New Tier', min: 0, multiplier: 1 })
}

const removeTier = (idx: number) => {
  tiers.value.splice(idx, 1)
}

const computeTier = (points: number) => {
  const current = [...tiers.value].sort((a, b) => b.min - a.min).find(t => points >= t.min)
  return current ? current.name : 'None'
}

const adjustPoints = (c: Customer, delta: number) => {
  c.points = Math.max(0, c.points + delta)
}
</script>



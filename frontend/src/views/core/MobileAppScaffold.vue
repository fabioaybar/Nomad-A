<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mobile App Scaffold</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Basic mobile-first layout and navigation placeholders.</p>

      <div class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Home</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Landing, featured vehicles, quick search.</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Browse</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Vehicle list, filters, detail screens.</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Auth, profile, settings.</p>
        </div>
      </div>

      <div class="fixed bottom-4 left-0 right-0 mx-auto max-w-md">
        <nav class="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <ul class="flex items-center justify-around py-3 text-sm">
            <li><a class="text-gray-700 dark:text-gray-200">Home</a></li>
            <li><a class="text-gray-700 dark:text-gray-200">Browse</a></li>
            <li><a class="text-gray-700 dark:text-gray-200">Account</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>



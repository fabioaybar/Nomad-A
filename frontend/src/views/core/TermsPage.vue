<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold mb-4 dark:text-gray-100">{{ t('terms.title') }}</h1>
    <p class="text-gray-600 mb-6 dark:text-gray-300">
      {{ t('terms.subtitle') }}
    </p>

    <div class="space-y-6 text-gray-700 dark:text-gray-200">
      <div>
        <h2 class="text-xl font-semibold mb-2">{{ t('terms.service_usage') }}</h2>
        <p>{{ t('terms.service_usage_desc') }}</p>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">{{ t('terms.accounts_security') }}</h2>
        <p>{{ t('terms.accounts_security_desc') }}</p>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">{{ t('terms.liability') }}</h2>
        <p>{{ t('terms.liability_desc') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTranslation } from '../../services/i18n'

const { t } = useTranslation()
</script>



<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ $t('admin.system_settings.title') }}
              </h1>
              <p class="mt-2 text-gray-600">
                {{ $t('admin.system_settings.subtitle') }}
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="saveAllSettings"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ $t('admin.system_settings.save_all') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Platform Configuration Tab -->
          <div v-if="activeTab === 'platform'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- General Settings -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.general_settings') }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.platform_name') }}
                    </label>
                    <input
                      v-model="settings.platform.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.platform_description') }}
                    </label>
                    <textarea
                      v-model="settings.platform.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.support_email') }}
                    </label>
                    <input
                      v-model="settings.platform.support_email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.timezone') }}
                    </label>
                    <select
                      v-model="settings.platform.timezone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Currency & Pricing -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.currency_pricing') }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.default_currency') }}
                    </label>
                    <select
                      v-model="settings.platform.default_currency"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.platform_commission') }} (%)
                    </label>
                    <input
                      v-model.number="settings.platform.commission_rate"
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.minimum_booking_amount') }}
                    </label>
                    <input
                      v-model.number="settings.platform.min_booking_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.maximum_booking_duration') }} ({{ $t('admin.system_settings.days') }})
                    </label>
                    <input
                      v-model.number="settings.platform.max_booking_duration"
                      type="number"
                      min="1"
                      max="365"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Toggles Tab -->
          <div v-if="activeTab === 'features'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Core Features -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.core_features') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.user_registration') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.allow_new_users') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('user_registration')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.user_registration ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.user_registration ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.vendor_registration') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.allow_new_vendors') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('vendor_registration')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.vendor_registration ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.vendor_registration ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.reviews_system') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_reviews') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('reviews_system')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.reviews_system ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.reviews_system ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.rewards_program') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_rewards') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('rewards_program')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.rewards_program ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.rewards_program ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Communication Features -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.communication_features') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.chat_system') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_chat') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('chat_system')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.chat_system ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.chat_system ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.email_notifications') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_email_notifications') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('email_notifications')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.email_notifications ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.push_notifications') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_push_notifications') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('push_notifications')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.push_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.push_notifications ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.sms_notifications') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_sms_notifications') }}</p>
                    </div>
                    <button
                      @click="toggleFeature('sms_notifications')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.features.sms_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.features.sms_notifications ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Authentication -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.authentication') }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.session_timeout') }} ({{ $t('admin.system_settings.minutes') }})
                    </label>
                    <input
                      v-model.number="settings.security.session_timeout"
                      type="number"
                      min="5"
                      max="480"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.max_login_attempts') }}
                    </label>
                    <input
                      v-model.number="settings.security.max_login_attempts"
                      type="number"
                      min="3"
                      max="10"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.password_min_length') }}
                    </label>
                    <input
                      v-model.number="settings.security.password_min_length"
                      type="number"
                      min="6"
                      max="20"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.two_factor_auth') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_2fa') }}</p>
                    </div>
                    <button
                      @click="toggleSecurity('two_factor_auth')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.security.two_factor_auth ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.security.two_factor_auth ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- API Security -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.api_security') }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.api_rate_limit') }} ({{ $t('admin.system_settings.requests_per_minute') }})
                    </label>
                    <input
                      v-model.number="settings.security.api_rate_limit"
                      type="number"
                      min="10"
                      max="1000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.cors_enabled') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_cors') }}</p>
                    </div>
                    <button
                      @click="toggleSecurity('cors_enabled')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.security.cors_enabled ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.security.cors_enabled ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.https_only') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.force_https') }}</p>
                    </div>
                    <button
                      @click="toggleSecurity('https_only')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.security.https_only ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.security.https_only ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.api_logging') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.enable_api_logging') }}</p>
                    </div>
                    <button
                      @click="toggleSecurity('api_logging')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.security.api_logging ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.security.api_logging ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maintenance Mode Tab -->
          <div v-if="activeTab === 'maintenance'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Maintenance Settings -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.maintenance_mode') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.enable_maintenance') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.put_site_in_maintenance') }}</p>
                    </div>
                    <button
                      @click="toggleMaintenance('enabled')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.maintenance.enabled ? 'bg-red-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.maintenance.enabled ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>

                  <div v-if="settings.maintenance.enabled">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.maintenance_message') }}
                    </label>
                    <textarea
                      v-model="settings.maintenance.message"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div v-if="settings.maintenance.enabled">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('admin.system_settings.estimated_downtime') }}
                    </label>
                    <input
                      v-model="settings.maintenance.estimated_downtime"
                      type="text"
                      :placeholder="$t('admin.system_settings.downtime_placeholder')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.allow_admin_access') }}</h4>
                      <p class="text-sm text-gray-500">{{ $t('admin.system_settings.admins_can_access') }}</p>
                    </div>
                    <button
                      @click="toggleMaintenance('allow_admin_access')"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        settings.maintenance.allow_admin_access ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.maintenance.allow_admin_access ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- System Status -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.system_settings.system_status') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.database') }}</span>
                    </div>
                    <span class="text-sm text-green-600">{{ $t('admin.system_settings.online') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.api_server') }}</span>
                    </div>
                    <span class="text-sm text-green-600">{{ $t('admin.system_settings.online') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.file_storage') }}</span>
                    </div>
                    <span class="text-sm text-green-600">{{ $t('admin.system_settings.online') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.email_service') }}</span>
                    </div>
                    <span class="text-sm text-green-600">{{ $t('admin.system_settings.online') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm font-medium text-gray-900">{{ $t('admin.system_settings.payment_gateway') }}</span>
                    </div>
                    <span class="text-sm text-green-600">{{ $t('admin.system_settings.online') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'
import api from '@/services/api'
import {
  Settings,
  ToggleLeft,
  Shield,
  Wrench,
  Save
} from 'lucide-vue-next'

const router = useRouter()
const notificationStore = useNotificationStore()

// State
const loading = ref(false)
const activeTab = ref('platform')

// Settings
const settings = ref({
  platform: {
    name: 'Car Rental Platform',
    description: 'Your trusted car rental service',
    support_email: 'support@carrental.com',
    timezone: 'UTC',
    default_currency: 'USD',
    commission_rate: 10.0,
    min_booking_amount: 25.00,
    max_booking_duration: 30
  },
  features: {
    user_registration: true,
    vendor_registration: true,
    reviews_system: true,
    rewards_program: true,
    chat_system: true,
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false
  },
  security: {
    session_timeout: 30,
    max_login_attempts: 5,
    password_min_length: 8,
    two_factor_auth: false,
    api_rate_limit: 100,
    cors_enabled: true,
    https_only: true,
    api_logging: true
  },
  maintenance: {
    enabled: false,
    message: 'We are currently performing scheduled maintenance. We will be back online shortly.',
    estimated_downtime: '2-4 hours',
    allow_admin_access: true
  }
})

// Tabs
const tabs = [
  { id: 'platform', name: 'Platform Configuration', icon: Settings },
  { id: 'features', name: 'Feature Toggles', icon: ToggleLeft },
  { id: 'security', name: 'Security Settings', icon: Shield },
  { id: 'maintenance', name: 'Maintenance Mode', icon: Wrench }
]

// Methods
const toggleFeature = (feature: string) => {
  settings.value.features[feature] = !settings.value.features[feature]
}

const toggleSecurity = (setting: string) => {
  settings.value.security[setting] = !settings.value.security[setting]
}

const toggleMaintenance = (setting: string) => {
  settings.value.maintenance[setting] = !settings.value.maintenance[setting]
}

const saveAllSettings = async () => {
  try {
    loading.value = true
    
    // In a real application, this would save to the backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'All settings have been saved successfully'
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to save settings'
    })
  } finally {
    loading.value = false
  }
}

const loadSettings = async () => {
  try {
    // In a real application, this would load from the backend
    // const response = await api.get('/admin/settings')
    // settings.value = response.data.data
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ $t('admin.content_management.title') }}
              </h1>
              <p class="mt-2 text-gray-600">
                {{ $t('admin.content_management.subtitle') }}
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="openCreateModal"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus class="w-4 h-4 mr-2" />
                {{ $t('admin.content_management.create_content') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
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
          <!-- Announcements Tab -->
          <div v-if="activeTab === 'announcements'" class="space-y-6">
            <!-- Filter and Search -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="filters.search"
                  type="text"
                  :placeholder="$t('admin.content_management.search_announcements')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                v-model="filters.status"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('admin.content_management.all_statuses') }}</option>
                <option value="active">{{ $t('admin.content_management.active') }}</option>
                <option value="inactive">{{ $t('admin.content_management.inactive') }}</option>
                <option value="scheduled">{{ $t('admin.content_management.scheduled') }}</option>
              </select>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ $t('admin.content_management.filter') }}
              </button>
            </div>

            <!-- Announcements List -->
            <div class="space-y-4">
              <div
                v-for="announcement in filteredAnnouncements"
                :key="announcement.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-lg font-medium text-gray-900">{{ announcement.title }}</h3>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          announcement.status === 'active' ? 'bg-green-100 text-green-800' :
                          announcement.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ $t(`admin.content_management.status.${announcement.status}`) }}
                      </span>
                      <span
                        v-if="announcement.priority === 'high'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {{ $t('admin.content_management.high_priority') }}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-3">{{ announcement.content }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ $t('admin.content_management.created') }}: {{ formatDate(announcement.created_at) }}</span>
                      <span v-if="announcement.scheduled_at">
                        {{ $t('admin.content_management.scheduled_for') }}: {{ formatDate(announcement.scheduled_at) }}
                      </span>
                      <span v-if="announcement.expires_at">
                        {{ $t('admin.content_management.expires') }}: {{ formatDate(announcement.expires_at) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="editAnnouncement(announcement)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleAnnouncementStatus(announcement)"
                      :class="[
                        'p-2 transition-colors',
                        announcement.status === 'active' ? 'text-gray-400 hover:text-yellow-600' : 'text-gray-400 hover:text-green-600'
                      ]"
                    >
                      <component :is="announcement.status === 'active' ? Pause : Play" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteAnnouncement(announcement)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredAnnouncements.length === 0" class="text-center py-12">
              <Megaphone class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('admin.content_management.no_announcements') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ $t('admin.content_management.create_first_announcement') }}</p>
            </div>
          </div>

          <!-- Promotional Campaigns Tab -->
          <div v-if="activeTab === 'campaigns'" class="space-y-6">
            <!-- Filter and Search -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="filters.search"
                  type="text"
                  :placeholder="$t('admin.content_management.search_campaigns')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                v-model="filters.status"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('admin.content_management.all_statuses') }}</option>
                <option value="active">{{ $t('admin.content_management.active') }}</option>
                <option value="inactive">{{ $t('admin.content_management.inactive') }}</option>
                <option value="scheduled">{{ $t('admin.content_management.scheduled') }}</option>
                <option value="completed">{{ $t('admin.content_management.completed') }}</option>
              </select>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ $t('admin.content_management.filter') }}
              </button>
            </div>

            <!-- Campaigns List -->
            <div class="space-y-4">
              <div
                v-for="campaign in filteredCampaigns"
                :key="campaign.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-lg font-medium text-gray-900">{{ campaign.name }}</h3>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        ]"
                      >
                        {{ $t(`admin.content_management.status.${campaign.status}`) }}
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {{ campaign.type }}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-3">{{ campaign.description }}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <p class="text-2xl font-bold text-blue-600">{{ campaign.impressions || 0 }}</p>
                        <p class="text-sm text-gray-600">{{ $t('admin.content_management.impressions') }}</p>
                      </div>
                      <div class="text-center p-3 bg-green-50 rounded-lg">
                        <p class="text-2xl font-bold text-green-600">{{ campaign.clicks || 0 }}</p>
                        <p class="text-sm text-gray-600">{{ $t('admin.content_management.clicks') }}</p>
                      </div>
                      <div class="text-center p-3 bg-purple-50 rounded-lg">
                        <p class="text-2xl font-bold text-purple-600">{{ campaign.conversions || 0 }}</p>
                        <p class="text-sm text-gray-600">{{ $t('admin.content_management.conversions') }}</p>
                      </div>
                      <div class="text-center p-3 bg-orange-50 rounded-lg">
                        <p class="text-2xl font-bold text-orange-600">{{ campaign.ctr || 0 }}%</p>
                        <p class="text-sm text-gray-600">{{ $t('admin.content_management.ctr') }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ $t('admin.content_management.created') }}: {{ formatDate(campaign.created_at) }}</span>
                      <span v-if="campaign.start_date">
                        {{ $t('admin.content_management.starts') }}: {{ formatDate(campaign.start_date) }}
                      </span>
                      <span v-if="campaign.end_date">
                        {{ $t('admin.content_management.ends') }}: {{ formatDate(campaign.end_date) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="editCampaign(campaign)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleCampaignStatus(campaign)"
                      :class="[
                        'p-2 transition-colors',
                        campaign.status === 'active' ? 'text-gray-400 hover:text-yellow-600' : 'text-gray-400 hover:text-green-600'
                      ]"
                    >
                      <component :is="campaign.status === 'active' ? Pause : Play" class="w-4 h-4" />
                    </button>
                    <button
                      @click="viewCampaignAnalytics(campaign)"
                      class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <BarChart3 class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteCampaign(campaign)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredCampaigns.length === 0" class="text-center py-12">
              <Target class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('admin.content_management.no_campaigns') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ $t('admin.content_management.create_first_campaign') }}</p>
            </div>
          </div>

          <!-- System Messages Tab -->
          <div v-if="activeTab === 'messages'" class="space-y-6">
            <!-- Filter and Search -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="filters.search"
                  type="text"
                  :placeholder="$t('admin.content_management.search_messages')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                v-model="filters.type"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('admin.content_management.all_types') }}</option>
                <option value="welcome">{{ $t('admin.content_management.welcome') }}</option>
                <option value="notification">{{ $t('admin.content_management.notification') }}</option>
                <option value="error">{{ $t('admin.content_management.error') }}</option>
                <option value="maintenance">{{ $t('admin.content_management.maintenance') }}</option>
              </select>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ $t('admin.content_management.filter') }}
              </button>
            </div>

            <!-- Messages List -->
            <div class="space-y-4">
              <div
                v-for="message in filteredMessages"
                :key="message.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-lg font-medium text-gray-900">{{ message.title }}</h3>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          message.type === 'welcome' ? 'bg-green-100 text-green-800' :
                          message.type === 'notification' ? 'bg-blue-100 text-blue-800' :
                          message.type === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ $t(`admin.content_management.type.${message.type}`) }}
                      </span>
                      <span
                        v-if="message.is_active"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ $t('admin.content_management.active') }}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-3">{{ message.content }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ $t('admin.content_management.created') }}: {{ formatDate(message.created_at) }}</span>
                      <span v-if="message.updated_at">
                        {{ $t('admin.content_management.updated') }}: {{ formatDate(message.updated_at) }}
                      </span>
                      <span v-if="message.display_location">
                        {{ $t('admin.content_management.location') }}: {{ message.display_location }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="editMessage(message)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleMessageStatus(message)"
                      :class="[
                        'p-2 transition-colors',
                        message.is_active ? 'text-gray-400 hover:text-yellow-600' : 'text-gray-400 hover:text-green-600'
                      ]"
                    >
                      <component :is="message.is_active ? EyeOff : Eye" class="w-4 h-4" />
                    </button>
                    <button
                      @click="previewMessage(message)"
                      class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <ExternalLink class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteMessage(message)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredMessages.length === 0" class="text-center py-12">
              <MessageSquare class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('admin.content_management.no_messages') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ $t('admin.content_management.create_first_message') }}</p>
            </div>
          </div>

          <!-- Platform Content Tab -->
          <div v-if="activeTab === 'content'" class="space-y-6">
            <!-- Content Sections -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="section in contentSections"
                :key="section.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                @click="editContentSection(section)"
              >
                <div class="flex items-center space-x-3 mb-4">
                  <component :is="section.icon" class="w-6 h-6 text-blue-600" />
                  <h3 class="text-lg font-medium text-gray-900">{{ section.name }}</h3>
                </div>
                <p class="text-gray-600 mb-4">{{ section.description }}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ $t('admin.content_management.last_updated') }}: {{ formatDate(section.last_updated) }}</span>
                  <span class="text-blue-600 hover:text-blue-800">{{ $t('admin.content_management.edit') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? $t('admin.content_management.edit_content') : $t('admin.content_management.create_content') }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.content_management.title') }}
              </label>
              <input
                v-model="formData.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.content_management.content') }}
              </label>
              <textarea
                v-model="formData.content"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div v-if="activeTab === 'announcements'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.priority') }}
                </label>
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">{{ $t('admin.content_management.low') }}</option>
                  <option value="medium">{{ $t('admin.content_management.medium') }}</option>
                  <option value="high">{{ $t('admin.content_management.high') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.status') }}
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">{{ $t('admin.content_management.active') }}</option>
                  <option value="inactive">{{ $t('admin.content_management.inactive') }}</option>
                  <option value="scheduled">{{ $t('admin.content_management.scheduled') }}</option>
                </select>
              </div>
            </div>
            
            <div v-if="activeTab === 'campaigns'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.campaign_type') }}
                </label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="banner">{{ $t('admin.content_management.banner') }}</option>
                  <option value="popup">{{ $t('admin.content_management.popup') }}</option>
                  <option value="email">{{ $t('admin.content_management.email') }}</option>
                  <option value="push">{{ $t('admin.content_management.push') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.status') }}
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">{{ $t('admin.content_management.active') }}</option>
                  <option value="inactive">{{ $t('admin.content_management.inactive') }}</option>
                  <option value="scheduled">{{ $t('admin.content_management.scheduled') }}</option>
                  <option value="completed">{{ $t('admin.content_management.completed') }}</option>
                </select>
              </div>
            </div>
            
            <div v-if="activeTab === 'messages'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.message_type') }}
                </label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="welcome">{{ $t('admin.content_management.welcome') }}</option>
                  <option value="notification">{{ $t('admin.content_management.notification') }}</option>
                  <option value="error">{{ $t('admin.content_management.error') }}</option>
                  <option value="maintenance">{{ $t('admin.content_management.maintenance') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('admin.content_management.display_location') }}
                </label>
                <select
                  v-model="formData.display_location"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="homepage">{{ $t('admin.content_management.homepage') }}</option>
                  <option value="dashboard">{{ $t('admin.content_management.dashboard') }}</option>
                  <option value="booking">{{ $t('admin.content_management.booking') }}</option>
                  <option value="global">{{ $t('admin.content_management.global') }}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.content_management.cancel') }}
            </button>
            <button
              @click="saveContent"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ isEditing ? $t('admin.content_management.update') : $t('admin.content_management.create') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'
import api from '@/services/api'
import {
  Megaphone,
  Target,
  MessageSquare,
  FileText,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Eye,
  EyeOff,
  ExternalLink,
  X
} from 'lucide-vue-next'

const router = useRouter()
const notificationStore = useNotificationStore()

// State
const loading = ref(false)
const activeTab = ref('announcements')
const showModal = ref(false)
const isEditing = ref(false)
const editingItem = ref(null)

// Filters
const filters = ref({
  search: '',
  status: '',
  type: ''
})

// Form Data
const formData = ref({
  title: '',
  content: '',
  priority: 'medium',
  status: 'active',
  type: 'banner',
  display_location: 'homepage'
})

// Mock Data
const announcements = ref([
  {
    id: 1,
    title: 'Welcome to Our Platform',
    content: 'We are excited to announce new features and improvements to enhance your car rental experience.',
    status: 'active',
    priority: 'high',
    created_at: '2024-01-15T10:00:00Z',
    scheduled_at: null,
    expires_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Maintenance Notice',
    content: 'Scheduled maintenance will occur on Sunday from 2 AM to 4 AM. Some features may be temporarily unavailable.',
    status: 'scheduled',
    priority: 'medium',
    created_at: '2024-01-14T15:30:00Z',
    scheduled_at: '2024-01-21T02:00:00Z',
    expires_at: '2024-01-21T04:00:00Z'
  }
])

const campaigns = ref([
  {
    id: 1,
    name: 'Summer Discount Campaign',
    description: 'Get 20% off on all summer bookings. Limited time offer!',
    type: 'banner',
    status: 'active',
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-03-31T23:59:59Z',
    created_at: '2024-01-01T10:00:00Z',
    impressions: 15420,
    clicks: 1234,
    conversions: 89,
    ctr: 8.0
  },
  {
    id: 2,
    name: 'New User Welcome',
    description: 'Welcome new users with a special discount code for their first booking.',
    type: 'email',
    status: 'active',
    start_date: '2024-01-01T00:00:00Z',
    end_date: null,
    created_at: '2024-01-01T10:00:00Z',
    impressions: 8500,
    clicks: 2100,
    conversions: 156,
    ctr: 24.7
  }
])

const messages = ref([
  {
    id: 1,
    title: 'Welcome Message',
    content: 'Welcome to our car rental platform! We are here to help you find the perfect vehicle for your needs.',
    type: 'welcome',
    is_active: true,
    display_location: 'homepage',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Booking Confirmation',
    content: 'Your booking has been confirmed. You will receive a confirmation email shortly.',
    type: 'notification',
    is_active: true,
    display_location: 'booking',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  }
])

const contentSections = ref([
  {
    id: 1,
    name: 'Homepage Hero',
    description: 'Main banner content and call-to-action',
    icon: FileText,
    last_updated: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'About Us',
    description: 'Company information and mission statement',
    icon: FileText,
    last_updated: '2024-01-10T10:00:00Z'
  },
  {
    id: 3,
    name: 'Terms of Service',
    description: 'Legal terms and conditions',
    icon: FileText,
    last_updated: '2024-01-05T10:00:00Z'
  },
  {
    id: 4,
    name: 'Privacy Policy',
    description: 'Data protection and privacy information',
    icon: FileText,
    last_updated: '2024-01-05T10:00:00Z'
  },
  {
    id: 5,
    name: 'Help Center',
    description: 'FAQ and support documentation',
    icon: FileText,
    last_updated: '2024-01-12T10:00:00Z'
  },
  {
    id: 6,
    name: 'Contact Information',
    description: 'Company contact details and support channels',
    icon: FileText,
    last_updated: '2024-01-08T10:00:00Z'
  }
])

// Tabs
const tabs = [
  { id: 'announcements', name: 'Announcements', icon: Megaphone },
  { id: 'campaigns', name: 'Promotional Campaigns', icon: Target },
  { id: 'messages', name: 'System Messages', icon: MessageSquare },
  { id: 'content', name: 'Platform Content', icon: FileText }
]

// Computed Properties
const filteredAnnouncements = computed(() => {
  let filtered = announcements.value
  
  if (filters.value.search) {
    filtered = filtered.filter(announcement =>
      announcement.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      announcement.content.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(announcement => announcement.status === filters.value.status)
  }
  
  return filtered
})

const filteredCampaigns = computed(() => {
  let filtered = campaigns.value
  
  if (filters.value.search) {
    filtered = filtered.filter(campaign =>
      campaign.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(campaign => campaign.status === filters.value.status)
  }
  
  return filtered
})

const filteredMessages = computed(() => {
  let filtered = messages.value
  
  if (filters.value.search) {
    filtered = filtered.filter(message =>
      message.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      message.content.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }
  
  if (filters.value.type) {
    filtered = filtered.filter(message => message.type === filters.value.type)
  }
  
  return filtered
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const applyFilters = () => {
  // Filters are applied automatically through computed properties
}

const openCreateModal = () => {
  isEditing.value = false
  editingItem.value = null
  resetForm()
  showModal.value = true
}

const editAnnouncement = (announcement: any) => {
  isEditing.value = true
  editingItem.value = announcement
  formData.value = {
    title: announcement.title,
    content: announcement.content,
    priority: announcement.priority,
    status: announcement.status,
    type: 'banner',
    display_location: 'homepage'
  }
  showModal.value = true
}

const editCampaign = (campaign: any) => {
  isEditing.value = true
  editingItem.value = campaign
  formData.value = {
    title: campaign.name,
    content: campaign.description,
    priority: 'medium',
    status: campaign.status,
    type: campaign.type,
    display_location: 'homepage'
  }
  showModal.value = true
}

const editMessage = (message: any) => {
  isEditing.value = true
  editingItem.value = message
  formData.value = {
    title: message.title,
    content: message.content,
    priority: 'medium',
    status: message.is_active ? 'active' : 'inactive',
    type: message.type,
    display_location: message.display_location
  }
  showModal.value = true
}

const editContentSection = (section: any) => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Edit Content Section',
    message: `Editing ${section.name} will be implemented soon`
  })
}

const toggleAnnouncementStatus = (announcement: any) => {
  announcement.status = announcement.status === 'active' ? 'inactive' : 'active'
  notificationStore.addNotification({
    type: 'success',
    title: 'Status Updated',
    message: `Announcement ${announcement.status === 'active' ? 'activated' : 'deactivated'} successfully`
  })
}

const toggleCampaignStatus = (campaign: any) => {
  campaign.status = campaign.status === 'active' ? 'inactive' : 'active'
  notificationStore.addNotification({
    type: 'success',
    title: 'Status Updated',
    message: `Campaign ${campaign.status === 'active' ? 'activated' : 'deactivated'} successfully`
  })
}

const toggleMessageStatus = (message: any) => {
  message.is_active = !message.is_active
  notificationStore.addNotification({
    type: 'success',
    title: 'Status Updated',
    message: `Message ${message.is_active ? 'activated' : 'deactivated'} successfully`
  })
}

const deleteAnnouncement = (announcement: any) => {
  if (confirm('Are you sure you want to delete this announcement?')) {
    const index = announcements.value.findIndex(a => a.id === announcement.id)
    if (index > -1) {
      announcements.value.splice(index, 1)
      notificationStore.addNotification({
        type: 'success',
        title: 'Announcement Deleted',
        message: 'Announcement deleted successfully'
      })
    }
  }
}

const deleteCampaign = (campaign: any) => {
  if (confirm('Are you sure you want to delete this campaign?')) {
    const index = campaigns.value.findIndex(c => c.id === campaign.id)
    if (index > -1) {
      campaigns.value.splice(index, 1)
      notificationStore.addNotification({
        type: 'success',
        title: 'Campaign Deleted',
        message: 'Campaign deleted successfully'
      })
    }
  }
}

const deleteMessage = (message: any) => {
  if (confirm('Are you sure you want to delete this message?')) {
    const index = messages.value.findIndex(m => m.id === message.id)
    if (index > -1) {
      messages.value.splice(index, 1)
      notificationStore.addNotification({
        type: 'success',
        title: 'Message Deleted',
        message: 'Message deleted successfully'
      })
    }
  }
}

const viewCampaignAnalytics = (campaign: any) => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Campaign Analytics',
    message: `Analytics for ${campaign.name} will be implemented soon`
  })
}

const previewMessage = (message: any) => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Message Preview',
    message: `Preview for ${message.title} will be implemented soon`
  })
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    priority: 'medium',
    status: 'active',
    type: 'banner',
    display_location: 'homepage'
  }
}

const saveContent = () => {
  if (!formData.value.title || !formData.value.content) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Validation Error',
      message: 'Please fill in all required fields'
    })
    return
  }

  if (isEditing.value) {
    // Update existing item
    if (activeTab.value === 'announcements' && editingItem.value) {
      editingItem.value.title = formData.value.title
      editingItem.value.content = formData.value.content
      editingItem.value.priority = formData.value.priority
      editingItem.value.status = formData.value.status
    } else if (activeTab.value === 'campaigns' && editingItem.value) {
      editingItem.value.name = formData.value.title
      editingItem.value.description = formData.value.content
      editingItem.value.type = formData.value.type
      editingItem.value.status = formData.value.status
    } else if (activeTab.value === 'messages' && editingItem.value) {
      editingItem.value.title = formData.value.title
      editingItem.value.content = formData.value.content
      editingItem.value.type = formData.value.type
      editingItem.value.is_active = formData.value.status === 'active'
      editingItem.value.display_location = formData.value.display_location
    }
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Content Updated',
      message: 'Content updated successfully'
    })
  } else {
    // Create new item
    const newItem = {
      id: Date.now(),
      title: formData.value.title,
      content: formData.value.content,
      created_at: new Date().toISOString(),
      ...(activeTab.value === 'announcements' ? {
        priority: formData.value.priority,
        status: formData.value.status,
        scheduled_at: null,
        expires_at: null
      } : {}),
      ...(activeTab.value === 'campaigns' ? {
        name: formData.value.title,
        description: formData.value.content,
        type: formData.value.type,
        status: formData.value.status,
        start_date: new Date().toISOString(),
        end_date: null,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0
      } : {}),
      ...(activeTab.value === 'messages' ? {
        type: formData.value.type,
        is_active: formData.value.status === 'active',
        display_location: formData.value.display_location,
        updated_at: null
      } : {})
    }

    if (activeTab.value === 'announcements') {
      announcements.value.push(newItem)
    } else if (activeTab.value === 'campaigns') {
      campaigns.value.push(newItem)
    } else if (activeTab.value === 'messages') {
      messages.value.push(newItem)
    }

    notificationStore.addNotification({
      type: 'success',
      title: 'Content Created',
      message: 'Content created successfully'
    })
  }

  closeModal()
}

// Lifecycle
onMounted(() => {
  // Load content data
})
</script>

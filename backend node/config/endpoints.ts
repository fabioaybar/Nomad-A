// API Endpoints Configuration for PHP/MySQL Backend

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    PROFILE: '/api/auth/profile',
  },

  // Users
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    SHOW: (id: number) => `/api/users/${id}`,
    UPDATE: (id: number) => `/api/users/${id}`,
    DELETE: (id: number) => `/api/users/${id}`,
    ACTIVATE: (id: number) => `/api/users/${id}/activate`,
    DEACTIVATE: (id: number) => `/api/users/${id}/deactivate`,
    STATS: (id: number) => `/api/users/${id}/stats`,
  },

  // Vendors
  VENDORS: {
    LIST: '/api/vendors',
    CREATE: '/api/vendors',
    SHOW: (id: number) => `/api/vendors/${id}`,
    UPDATE: (id: number) => `/api/vendors/${id}`,
    DELETE: (id: number) => `/api/vendors/${id}`,
    VERIFY: (id: number) => `/api/vendors/${id}/verify`,
    UNVERIFY: (id: number) => `/api/vendors/${id}/unverify`,
    STATS: (id: number) => `/api/vendors/${id}/stats`,
    VEHICLES: (id: number) => `/api/vendors/${id}/vehicles`,
    BOOKINGS: (id: number) => `/api/vendors/${id}/bookings`,
    REVIEWS: (id: number) => `/api/vendors/${id}/reviews`,
  },

  // Vehicles
  VEHICLES: {
    LIST: '/api/vehicles',
    CREATE: '/api/vehicles',
    SHOW: (id: number) => `/api/vehicles/${id}`,
    UPDATE: (id: number) => `/api/vehicles/${id}`,
    DELETE: (id: number) => `/api/vehicles/${id}`,
    AVAILABLE: '/api/vehicles/available',
    SEARCH: '/api/vehicles/search',
    NEARBY: '/api/vehicles/nearby',
    FEATURES: '/api/vehicles/features',
    MAKES: '/api/vehicles/makes',
    MODELS: '/api/vehicles/models',
    UPLOAD_IMAGE: (id: number) => `/api/vehicles/${id}/images`,
    DELETE_IMAGE: (id: number, imageId: number) => `/api/vehicles/${id}/images/${imageId}`,
    SET_PRIMARY_IMAGE: (id: number, imageId: number) => `/api/vehicles/${id}/images/${imageId}/primary`,
  },

  // Bookings
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    SHOW: (id: number) => `/api/bookings/${id}`,
    UPDATE: (id: number) => `/api/bookings/${id}`,
    DELETE: (id: number) => `/api/bookings/${id}`,
    CONFIRM: (id: number) => `/api/bookings/${id}/confirm`,
    CANCEL: (id: number) => `/api/bookings/${id}/cancel`,
    COMPLETE: (id: number) => `/api/bookings/${id}/complete`,
    PAYMENT: (id: number) => `/api/bookings/${id}/payment`,
    REFUND: (id: number) => `/api/bookings/${id}/refund`,
    CALCULATE_COST: '/api/bookings/calculate-cost',
    CHECK_AVAILABILITY: '/api/bookings/check-availability',
    USER_BOOKINGS: (userId: number) => `/api/users/${userId}/bookings`,
    VENDOR_BOOKINGS: (vendorId: number) => `/api/vendors/${vendorId}/bookings`,
    VEHICLE_BOOKINGS: (vehicleId: number) => `/api/vehicles/${vehicleId}/bookings`,
  },

  // Reviews
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews',
    SHOW: (id: number) => `/api/reviews/${id}`,
    UPDATE: (id: number) => `/api/reviews/${id}`,
    DELETE: (id: number) => `/api/reviews/${id}`,
    VEHICLE_REVIEWS: (vehicleId: number) => `/api/vehicles/${vehicleId}/reviews`,
    VENDOR_REVIEWS: (vendorId: number) => `/api/vendors/${vendorId}/reviews`,
    USER_REVIEWS: (userId: number) => `/api/users/${userId}/reviews`,
    BOOKING_REVIEW: (bookingId: number) => `/api/bookings/${bookingId}/review`,
  },

  // Maintenance
  MAINTENANCE: {
    LIST: '/api/maintenance',
    CREATE: '/api/maintenance',
    SHOW: (id: number) => `/api/maintenance/${id}`,
    UPDATE: (id: number) => `/api/maintenance/${id}`,
    DELETE: (id: number) => `/api/maintenance/${id}`,
    COMPLETE: (id: number) => `/api/maintenance/${id}/complete`,
    VEHICLE_MAINTENANCE: (vehicleId: number) => `/api/vehicles/${vehicleId}/maintenance`,
    VENDOR_MAINTENANCE: (vendorId: number) => `/api/vendors/${vendorId}/maintenance`,
    SCHEDULE: '/api/maintenance/schedule',
  },

  // Rewards & Discounts
  REWARDS: {
    LIST: '/api/rewards',
    CREATE: '/api/rewards',
    SHOW: (id: number) => `/api/rewards/${id}`,
    UPDATE: (id: number) => `/api/rewards/${id}`,
    DELETE: (id: number) => `/api/rewards/${id}`,
    USER_REWARDS: (userId: number) => `/api/users/${userId}/rewards`,
    EARN_POINTS: (userId: number) => `/api/users/${userId}/rewards/earn`,
    USE_POINTS: (userId: number) => `/api/users/${userId}/rewards/use`,
  },

  DISCOUNTS: {
    LIST: '/api/discounts',
    CREATE: '/api/discounts',
    SHOW: (id: number) => `/api/discounts/${id}`,
    UPDATE: (id: number) => `/api/discounts/${id}`,
    DELETE: (id: number) => `/api/discounts/${id}`,
    ACTIVATE: (id: number) => `/api/discounts/${id}/activate`,
    DEACTIVATE: (id: number) => `/api/discounts/${id}/deactivate`,
    AVAILABLE: '/api/discounts/available',
    USER_DISCOUNTS: (userId: number) => `/api/users/${userId}/discounts`,
    APPLY: (userId: number) => `/api/users/${userId}/discounts/apply`,
    REMOVE: (userId: number) => `/api/users/${userId}/discounts/remove`,
  },

  // Chat & Messaging
  CONVERSATIONS: {
    LIST: '/api/conversations',
    CREATE: '/api/conversations',
    SHOW: (id: number) => `/api/conversations/${id}`,
    UPDATE: (id: number) => `/api/conversations/${id}`,
    DELETE: (id: number) => `/api/conversations/${id}`,
    CLOSE: (id: number) => `/api/conversations/${id}/close`,
    ARCHIVE: (id: number) => `/api/conversations/${id}/archive`,
    USER_CONVERSATIONS: (userId: number) => `/api/users/${userId}/conversations`,
    VENDOR_CONVERSATIONS: (vendorId: number) => `/api/vendors/${vendorId}/conversations`,
    ADMIN_CONVERSATIONS: '/api/admin/conversations',
  },

  MESSAGES: {
    LIST: (conversationId: number) => `/api/conversations/${conversationId}/messages`,
    CREATE: (conversationId: number) => `/api/conversations/${conversationId}/messages`,
    SHOW: (conversationId: number, messageId: number) => `/api/conversations/${conversationId}/messages/${messageId}`,
    UPDATE: (conversationId: number, messageId: number) => `/api/conversations/${conversationId}/messages/${messageId}`,
    DELETE: (conversationId: number, messageId: number) => `/api/conversations/${conversationId}/messages/${messageId}`,
    MARK_READ: (conversationId: number, messageId: number) => `/api/conversations/${conversationId}/messages/${messageId}/read`,
    UPLOAD_FILE: (conversationId: number) => `/api/conversations/${conversationId}/messages/upload`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    CREATE: '/api/notifications',
    SHOW: (id: number) => `/api/notifications/${id}`,
    UPDATE: (id: number) => `/api/notifications/${id}`,
    DELETE: (id: number) => `/api/notifications/${id}`,
    MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    USER_NOTIFICATIONS: (userId: number) => `/api/users/${userId}/notifications`,
    UNREAD_COUNT: (userId: number) => `/api/users/${userId}/notifications/unread-count`,
  },

  // File Uploads
  UPLOADS: {
    VEHICLE_IMAGE: '/api/uploads/vehicle-image',
    VENDOR_LOGO: '/api/uploads/vendor-logo',
    USER_AVATAR: '/api/uploads/user-avatar',
    DOCUMENT: '/api/uploads/document',
    DELETE: (id: number) => `/api/uploads/${id}`,
  },

  // System & Admin
  SYSTEM: {
    SETTINGS: '/api/system/settings',
    UPDATE_SETTING: (key: string) => `/api/system/settings/${key}`,
    STATS: '/api/system/stats',
    HEALTH: '/api/system/health',
    VERSION: '/api/system/version',
  },

  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    VENDORS: '/api/admin/vendors',
    VEHICLES: '/api/admin/vehicles',
    BOOKINGS: '/api/admin/bookings',
    REVIEWS: '/api/admin/reviews',
    MAINTENANCE: '/api/admin/maintenance',
    REWARDS: '/api/admin/rewards',
    DISCOUNTS: '/api/admin/discounts',
    CONVERSATIONS: '/api/admin/conversations',
    NOTIFICATIONS: '/api/admin/notifications',
    AUDIT_LOGS: '/api/admin/audit-logs',
    SYSTEM_SETTINGS: '/api/admin/system-settings',
  },

  // Reports
  REPORTS: {
    BOOKINGS: '/api/reports/bookings',
    REVENUE: '/api/reports/revenue',
    VEHICLES: '/api/reports/vehicles',
    VENDORS: '/api/reports/vendors',
    USERS: '/api/reports/users',
    MAINTENANCE: '/api/reports/maintenance',
    EXPORT: (type: string) => `/api/reports/export/${type}`,
  },

  // External APIs
  EXTERNAL: {
    CURRENCY_CONVERSION: '/api/external/currency-conversion',
    GEOCODING: '/api/external/geocoding',
    WEATHER: '/api/external/weather',
    PAYMENT_GATEWAY: '/api/external/payment-gateway',
    SMS: '/api/external/sms',
    EMAIL: '/api/external/email',
  },
} as const

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

// API Response Status Codes
export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// API Headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_CSRF_TOKEN: 'X-CSRF-Token',
  X_API_KEY: 'X-API-Key',
} as const

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const

// Backend Types Index - Export all types for easy importing

// Entity Types
export type {
  User,
  Vendor,
  Vehicle,
  Booking,
  Review,
  Maintenance,
  Reward,
  Discount,
  UserRewards,
  ChatMessage,
  Conversation,
  Notification,
  SystemSettings,
  AuditLog
} from '../types/entities'

// DTO Types
export type {
  ApiResponse,
  PaginationParams,
  SearchParams,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  UserUpdateRequest,
  UserListParams,
  VendorCreateRequest,
  VendorUpdateRequest,
  VendorListParams,
  VehicleCreateRequest,
  VehicleUpdateRequest,
  VehicleListParams,
  BookingCreateRequest,
  BookingUpdateRequest,
  BookingListParams,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  ReviewListParams,
  MaintenanceCreateRequest,
  MaintenanceUpdateRequest,
  MaintenanceListParams,
  RewardCreateRequest,
  RewardListParams,
  DiscountCreateRequest,
  DiscountUpdateRequest,
  DiscountListParams,
  ChatMessageCreateRequest,
  ConversationCreateRequest,
  ConversationListParams,
  NotificationCreateRequest,
  NotificationListParams,
  SystemSettingsUpdateRequest,
  SystemSettingsListParams,
  AuditLogListParams,
  FileUploadRequest,
  FileUploadResponse,
  DashboardStats,
  VendorStats,
  UserStats
} from '../types/dto'

// Schema Types
export type {
  UsersTable,
  VendorsTable,
  VehiclesTable,
  BookingsTable,
  ReviewsTable,
  MaintenanceTable,
  RewardsTable,
  DiscountsTable,
  UserRewardsTable,
  ConversationsTable,
  ChatMessagesTable,
  NotificationsTable,
  SystemSettingsTable,
  AuditLogsTable,
  UserDiscountsTable,
  VehicleFeaturesTable,
  VehicleImagesTable,
  DatabaseIndexes,
  DatabaseConstraints
} from '../types/schema'

// Configuration Types
export type {
  ApiConfig,
  RequestOptions
} from '../services/BaseApiService'

// Re-export API endpoints and constants
export {
  API_ENDPOINTS,
  HTTP_METHODS,
  API_STATUS_CODES,
  API_HEADERS,
  CONTENT_TYPES
} from '../config/endpoints'

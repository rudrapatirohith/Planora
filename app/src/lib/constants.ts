// ============================================================
// Planora — Brand & App Constants
// Easy to rename: change BRAND_NAME and update CSS --brand-* vars
// ============================================================

export const BRAND_NAME = 'Planora'
export const BRAND_TAGLINE = 'Travel smarter, live fuller'
export const BRAND_DESCRIPTION = 'Plan your perfect trip with intelligent itinerary management, expense tracking, and AI-powered suggestions.'

// ============================================================
// TRIP CONSTANTS
// ============================================================

export const TRIP_STATUSES = ['planning', 'active', 'completed', 'archived'] as const
export type TripStatusLabel = {
  value: string
  label: string
  description: string
}
export const TRIP_STATUS_LABELS: TripStatusLabel[] = [
  { value: 'planning', label: 'Planning', description: 'Trip is being planned' },
  { value: 'active', label: 'Active', description: 'Trip is happening now' },
  { value: 'completed', label: 'Completed', description: 'Trip has ended' },
  { value: 'archived', label: 'Archived', description: 'Trip is archived' },
]

// ============================================================
// BOOKING CONSTANTS
// ============================================================

export const BOOKING_TYPES = [
  { value: 'flight', label: 'Flight', icon: 'Plane' },
  { value: 'hotel', label: 'Hotel', icon: 'Building2' },
  { value: 'train', label: 'Train', icon: 'Train' },
  { value: 'bus', label: 'Bus', icon: 'Bus' },
  { value: 'car_rental', label: 'Car Rental', icon: 'Car' },
  { value: 'tour', label: 'Tour', icon: 'Map' },
  { value: 'other', label: 'Other', icon: 'Package' },
] as const

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
] as const

// ============================================================
// ITINERARY CONSTANTS
// ============================================================

export const ITINERARY_TYPES = [
  { value: 'activity', label: 'Activity', icon: 'Star', color: '#f59e0b' },
  { value: 'flight', label: 'Flight', icon: 'Plane', color: '#3b82f6' },
  { value: 'hotel', label: 'Hotel', icon: 'Building2', color: '#8b5cf6' },
  { value: 'transport', label: 'Transport', icon: 'Car', color: '#06b6d4' },
  { value: 'food', label: 'Food & Drink', icon: 'UtensilsCrossed', color: '#ef4444' },
  { value: 'sightseeing', label: 'Sightseeing', icon: 'Camera', color: '#10b981' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal', color: '#6b7280' },
] as const

// ============================================================
// CURRENCY CONSTANTS
// ============================================================

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
] as const

// ============================================================
// BUDGET CATEGORY DEFAULTS
// ============================================================

export const DEFAULT_BUDGET_CATEGORIES = [
  { name: 'Accommodation', color: '#8b5cf6', planned_amount: 0 },
  { name: 'Food & Drink', color: '#ef4444', planned_amount: 0 },
  { name: 'Transport', color: '#3b82f6', planned_amount: 0 },
  { name: 'Activities', color: '#f59e0b', planned_amount: 0 },
  { name: 'Shopping', color: '#10b981', planned_amount: 0 },
  { name: 'Miscellaneous', color: '#6b7280', planned_amount: 0 },
]

// ============================================================
// CHECKLIST DEFAULTS
// ============================================================

export const DEFAULT_PACKING_ITEMS = [
  { text: 'Passport / ID', category: 'Documents' },
  { text: 'Travel insurance documents', category: 'Documents' },
  { text: 'Phone & charger', category: 'Electronics' },
  { text: 'Power bank', category: 'Electronics' },
  { text: 'Adapter / converter', category: 'Electronics' },
  { text: 'Medications', category: 'Health' },
  { text: 'First aid basics', category: 'Health' },
  { text: 'Sunscreen', category: 'Health' },
  { text: 'Comfortable walking shoes', category: 'Clothing' },
  { text: 'Weather-appropriate clothing', category: 'Clothing' },
  { text: 'Camera', category: 'Electronics' },
  { text: 'Snacks for the journey', category: 'Food' },
]

export const DEFAULT_DOCUMENT_ITEMS = [
  { text: 'Passport (valid for 6+ months)', category: 'ID' },
  { text: 'Visa (if required)', category: 'ID' },
  { text: 'Travel insurance policy', category: 'Insurance' },
  { text: 'Flight tickets / boarding passes', category: 'Transport' },
  { text: 'Hotel confirmations', category: 'Accommodation' },
  { text: 'Emergency contacts list', category: 'Safety' },
  { text: 'Health/vaccination records (if needed)', category: 'Health' },
]

export const DEFAULT_REMINDER_ITEMS = [
  { text: 'Check-in for flight (24h before)', category: 'Flight' },
  { text: 'Notify bank of travel dates', category: 'Finance' },
  { text: 'Set up international data plan', category: 'Communication' },
  { text: 'Arrange pet/plant care', category: 'Home' },
  { text: 'Set up mail hold or forwarding', category: 'Home' },
  { text: 'Download offline maps', category: 'Navigation' },
]

// ============================================================
// UI CONSTANTS
// ============================================================

export const PAGE_SIZE = 20
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const CHART_COLORS = [
  '#8b5cf6', '#ef4444', '#3b82f6', '#f59e0b',
  '#10b981', '#6b7280', '#ec4899', '#06b6d4',
  '#84cc16', '#f97316',
]

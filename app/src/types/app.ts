import type {
  Trip,
  ItineraryDay,
  ItineraryItem,
  Booking,
  BudgetCategory,
  Expense,
  ExpenseSplit,
  Checklist,
  ChecklistItem,
  Profile,
} from './database'

// Extended types with computed or joined data
export interface TripWithStats extends Trip {
  daysUntilStart?: number
  duration?: number
  isUpcoming?: boolean
  isPast?: boolean
  isActive?: boolean
  totalExpenses?: number
  expenseCount?: number
}

export interface ItineraryDayWithItems extends ItineraryDay {
  items: ItineraryItem[]
}

export interface BudgetCategoryWithStats extends BudgetCategory {
  actual_amount: number
  variance: number
  percentage: number
  isOverBudget: boolean
}

export interface ExpenseWithCategory extends Expense {
  category?: BudgetCategory | null
  splits?: ExpenseSplit[]
}

export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[]
  completedCount: number
  totalCount: number
  percentage: number
}

export interface TripStats {
  totalTrips: number
  upcomingTrips: number
  totalDaysTraveled: number
  uniqueDestinations: number
  totalSpent: number
}

// Form types
export interface CreateTripFormData {
  name: string
  destination: string
  start_date: string
  end_date: string
  travelers: number
  status: Trip['status']
  notes?: string
  total_budget?: number
  currency: string
}

export interface CreateItineraryItemFormData {
  type: ItineraryItem['type']
  title: string
  description?: string
  start_time?: string
  end_time?: string
  location?: string
  booking_reference?: string
  amount?: number
  currency: string
  notes?: string
}

export interface CreateBookingFormData {
  type: Booking['type']
  title: string
  provider?: string
  confirmation_number?: string
  start_date?: string
  end_date?: string
  amount?: number
  currency: string
  status: Booking['status']
  notes?: string
}

export interface CreateExpenseFormData {
  title: string
  amount: number
  currency: string
  date: string
  category_id?: string
  paid_by?: string
  notes?: string
  is_split?: boolean
}

export interface ExpenseSplitFormData {
  person_name: string
  amount_owed: number
  is_reimbursed: boolean
}

// Action result type for server actions
export interface ActionResult<T> {
  data?: T
  error?: string
  success: boolean
}

// Dashboard chart data
export interface ExpenseBreakdownItem {
  name: string
  value: number
  color: string
  percentage: number
}

export interface BudgetComparisonItem {
  category: string
  planned: number
  actual: number
  color: string
}

// Re-export DB types for convenience
export type {
  Profile,
  Trip,
  ItineraryDay,
  ItineraryItem,
  Booking,
  BudgetCategory,
  Expense,
  ExpenseSplit,
  Checklist,
  ChecklistItem,
}

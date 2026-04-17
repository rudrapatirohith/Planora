export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferred_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_currency?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          name: string
          destination: string
          start_date: string
          end_date: string
          travelers: number
          status: 'planning' | 'active' | 'completed' | 'archived'
          notes: string | null
          cover_image_url: string | null
          total_budget: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          destination: string
          start_date: string
          end_date: string
          travelers?: number
          status?: 'planning' | 'active' | 'completed' | 'archived'
          notes?: string | null
          cover_image_url?: string | null
          total_budget?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          destination?: string
          start_date?: string
          end_date?: string
          travelers?: number
          status?: 'planning' | 'active' | 'completed' | 'archived'
          notes?: string | null
          cover_image_url?: string | null
          total_budget?: number
          currency?: string
          updated_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          trip_id: string
          day_date: string
          day_number: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          day_date: string
          day_number: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          notes?: string | null
        }
      }
      itinerary_items: {
        Row: {
          id: string
          day_id: string
          trip_id: string
          type: 'activity' | 'flight' | 'hotel' | 'transport' | 'food' | 'sightseeing' | 'other'
          title: string
          description: string | null
          start_time: string | null
          end_time: string | null
          location: string | null
          booking_reference: string | null
          amount: number | null
          currency: string
          notes: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_id: string
          trip_id: string
          type: 'activity' | 'flight' | 'hotel' | 'transport' | 'food' | 'sightseeing' | 'other'
          title: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          booking_reference?: string | null
          amount?: number | null
          currency?: string
          notes?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'activity' | 'flight' | 'hotel' | 'transport' | 'food' | 'sightseeing' | 'other'
          title?: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          booking_reference?: string | null
          amount?: number | null
          currency?: string
          notes?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          trip_id: string
          type: 'flight' | 'hotel' | 'train' | 'bus' | 'car_rental' | 'tour' | 'other'
          title: string
          provider: string | null
          confirmation_number: string | null
          start_date: string | null
          end_date: string | null
          amount: number | null
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          type: 'flight' | 'hotel' | 'train' | 'bus' | 'car_rental' | 'tour' | 'other'
          title: string
          provider?: string | null
          confirmation_number?: string | null
          start_date?: string | null
          end_date?: string | null
          amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'flight' | 'hotel' | 'train' | 'bus' | 'car_rental' | 'tour' | 'other'
          title?: string
          provider?: string | null
          confirmation_number?: string | null
          start_date?: string | null
          end_date?: string | null
          amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          document_url?: string | null
          updated_at?: string
        }
      }
      budget_categories: {
        Row: {
          id: string
          trip_id: string
          name: string
          planned_amount: number
          color: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          name: string
          planned_amount?: number
          color?: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          name?: string
          planned_amount?: number
          color?: string
          sort_order?: number
        }
      }
      expenses: {
        Row: {
          id: string
          trip_id: string
          category_id: string | null
          title: string
          amount: number
          currency: string
          amount_usd: number | null
          date: string
          paid_by: string | null
          notes: string | null
          receipt_url: string | null
          is_split: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          category_id?: string | null
          title: string
          amount: number
          currency?: string
          amount_usd?: number | null
          date: string
          paid_by?: string | null
          notes?: string | null
          receipt_url?: string | null
          is_split?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          title?: string
          amount?: number
          currency?: string
          amount_usd?: number | null
          date?: string
          paid_by?: string | null
          notes?: string | null
          receipt_url?: string | null
          is_split?: boolean
          updated_at?: string
        }
      }
      expense_splits: {
        Row: {
          id: string
          expense_id: string
          person_name: string
          amount_owed: number
          is_reimbursed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          person_name: string
          amount_owed: number
          is_reimbursed?: boolean
          created_at?: string
        }
        Update: {
          person_name?: string
          amount_owed?: number
          is_reimbursed?: boolean
        }
      }
      checklists: {
        Row: {
          id: string
          trip_id: string
          name: string
          type: 'packing' | 'documents' | 'reminders' | 'custom'
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          name: string
          type?: 'packing' | 'documents' | 'reminders' | 'custom'
          sort_order?: number
          created_at?: string
        }
        Update: {
          name?: string
          type?: 'packing' | 'documents' | 'reminders' | 'custom'
          sort_order?: number
        }
      }
      checklist_items: {
        Row: {
          id: string
          checklist_id: string
          trip_id: string
          text: string
          is_checked: boolean
          category: string | null
          due_date: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          checklist_id: string
          trip_id: string
          text: string
          is_checked?: boolean
          category?: string | null
          due_date?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          text?: string
          is_checked?: boolean
          category?: string | null
          due_date?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Convenience type aliases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Trip = Tables<'trips'>
export type ItineraryDay = Tables<'itinerary_days'>
export type ItineraryItem = Tables<'itinerary_items'>
export type Booking = Tables<'bookings'>
export type BudgetCategory = Tables<'budget_categories'>
export type Expense = Tables<'expenses'>
export type ExpenseSplit = Tables<'expense_splits'>
export type Checklist = Tables<'checklists'>
export type ChecklistItem = Tables<'checklist_items'>

export type TripStatus = Trip['status']
export type BookingType = Booking['type']
export type BookingStatus = Booking['status']
export type ItineraryItemType = ItineraryItem['type']
export type ChecklistType = Checklist['type']

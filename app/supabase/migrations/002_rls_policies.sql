-- ============================================================
-- Planora — RLS Policies Migration
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items  ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- PROFILES
-- --------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------
-- TRIPS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own trips"
  ON public.trips FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------
-- ITINERARY DAYS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own itinerary days"
  ON public.itinerary_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = itinerary_days.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- ITINERARY ITEMS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own itinerary items"
  ON public.itinerary_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = itinerary_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- BOOKINGS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = bookings.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- BUDGET CATEGORIES
-- --------------------------------------------------------
CREATE POLICY "Users can manage own budget categories"
  ON public.budget_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = budget_categories.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- EXPENSES
-- --------------------------------------------------------
CREATE POLICY "Users can manage own expenses"
  ON public.expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- EXPENSE SPLITS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own expense splits"
  ON public.expense_splits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.trips t ON t.id = e.trip_id
      WHERE e.id = expense_splits.expense_id
        AND t.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- CHECKLISTS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own checklists"
  ON public.checklists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = checklists.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- CHECKLIST ITEMS
-- --------------------------------------------------------
CREATE POLICY "Users can manage own checklist items"
  ON public.checklist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = checklist_items.trip_id
        AND trips.user_id = auth.uid()
    )
  );

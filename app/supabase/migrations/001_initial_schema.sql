-- ============================================================
-- Planora — Initial Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- PROFILES (extends auth.users)
-- --------------------------------------------------------
CREATE TABLE public.profiles (
  id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email          TEXT NOT NULL,
  full_name      TEXT,
  avatar_url     TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- TRIPS
-- --------------------------------------------------------
CREATE TABLE public.trips (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name           TEXT NOT NULL,
  destination    TEXT NOT NULL,
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  travelers      INT DEFAULT 1 NOT NULL CHECK (travelers > 0),
  status         TEXT DEFAULT 'planning' NOT NULL
                   CHECK (status IN ('planning','active','completed','archived')),
  notes          TEXT,
  cover_image_url TEXT,
  total_budget   NUMERIC(12,2) DEFAULT 0,
  currency       TEXT DEFAULT 'USD' NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- ITINERARY DAYS
-- --------------------------------------------------------
CREATE TABLE public.itinerary_days (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id        UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  day_date       DATE NOT NULL,
  day_number     INT NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(trip_id, day_date)
);

-- --------------------------------------------------------
-- ITINERARY ITEMS
-- --------------------------------------------------------
CREATE TABLE public.itinerary_items (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_id            UUID REFERENCES public.itinerary_days(id) ON DELETE CASCADE NOT NULL,
  trip_id           UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  type              TEXT NOT NULL
                      CHECK (type IN ('activity','flight','hotel','transport','food','sightseeing','other')),
  title             TEXT NOT NULL,
  description       TEXT,
  start_time        TIME,
  end_time          TIME,
  location          TEXT,
  booking_reference TEXT,
  amount            NUMERIC(12,2),
  currency          TEXT DEFAULT 'USD',
  notes             TEXT,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- BOOKINGS
-- --------------------------------------------------------
CREATE TABLE public.bookings (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id             UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  type                TEXT NOT NULL
                        CHECK (type IN ('flight','hotel','train','bus','car_rental','tour','other')),
  title               TEXT NOT NULL,
  provider            TEXT,
  confirmation_number TEXT,
  start_date          TIMESTAMPTZ,
  end_date            TIMESTAMPTZ,
  amount              NUMERIC(12,2),
  currency            TEXT DEFAULT 'USD',
  status              TEXT DEFAULT 'confirmed'
                        CHECK (status IN ('pending','confirmed','cancelled','completed')),
  notes               TEXT,
  document_url        TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- BUDGET CATEGORIES
-- --------------------------------------------------------
CREATE TABLE public.budget_categories (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id        UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  name           TEXT NOT NULL,
  planned_amount NUMERIC(12,2) DEFAULT 0,
  color          TEXT DEFAULT '#6366f1',
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- EXPENSES
-- --------------------------------------------------------
CREATE TABLE public.expenses (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id       UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  category_id   UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency      TEXT DEFAULT 'USD' NOT NULL,
  amount_usd    NUMERIC(12,2),
  date          DATE NOT NULL,
  paid_by       TEXT,
  notes         TEXT,
  receipt_url   TEXT,
  is_split      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- EXPENSE SPLITS
-- --------------------------------------------------------
CREATE TABLE public.expense_splits (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  expense_id      UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
  person_name     TEXT NOT NULL,
  amount_owed     NUMERIC(12,2) NOT NULL,
  is_reimbursed   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- CHECKLISTS
-- --------------------------------------------------------
CREATE TABLE public.checklists (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id    UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  type       TEXT DEFAULT 'packing'
               CHECK (type IN ('packing','documents','reminders','custom')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- CHECKLIST ITEMS
-- --------------------------------------------------------
CREATE TABLE public.checklist_items (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  checklist_id  UUID REFERENCES public.checklists(id) ON DELETE CASCADE NOT NULL,
  trip_id       UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  text          TEXT NOT NULL,
  is_checked    BOOLEAN DEFAULT FALSE,
  category      TEXT,
  due_date      DATE,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------
-- INDEXES
-- --------------------------------------------------------
CREATE INDEX idx_trips_user_id         ON public.trips(user_id);
CREATE INDEX idx_trips_status          ON public.trips(status);
CREATE INDEX idx_trips_start_date      ON public.trips(start_date);
CREATE INDEX idx_itinerary_days_trip   ON public.itinerary_days(trip_id);
CREATE INDEX idx_itinerary_items_day   ON public.itinerary_items(day_id);
CREATE INDEX idx_itinerary_items_trip  ON public.itinerary_items(trip_id);
CREATE INDEX idx_bookings_trip_id      ON public.bookings(trip_id);
CREATE INDEX idx_bookings_type         ON public.bookings(type);
CREATE INDEX idx_expenses_trip_id      ON public.expenses(trip_id);
CREATE INDEX idx_expenses_category     ON public.expenses(category_id);
CREATE INDEX idx_expenses_date         ON public.expenses(date);
CREATE INDEX idx_checklist_items_trip  ON public.checklist_items(trip_id);
CREATE INDEX idx_checklist_items_list  ON public.checklist_items(checklist_id);

-- --------------------------------------------------------
-- UPDATED_AT TRIGGER
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_itinerary_items_updated_at
  BEFORE UPDATE ON public.itinerary_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_checklist_items_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------
-- AUTO-CREATE PROFILE ON SIGNUP
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

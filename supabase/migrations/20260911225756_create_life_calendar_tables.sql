/*
# Create life_calendar table (single-tenant, no auth)

1. New Tables
- `life_calendar`
  - `id` (uuid, primary key)
  - `birth_date` (date, not null) — the user's birth date, used to compute the life grid
  - `life_expectancy` (int, default 80) — number of years to display in the grid
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz) — automatically updated on modification

- `week_notes`
  - `id` (uuid, primary key)
  - `calendar_id` (uuid, FK → life_calendar, cascade delete)
  - `week_index` (int, not null) — 0-based index of the week in the life grid
  - `note` (text, nullable) — user's note for that week
  - `color` (text, default '#3b82f6') — color tag for the week
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - Unique constraint on (calendar_id, week_index) so each week has at most one note entry

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD since this is a single-tenant app with no sign-in.
- `USING (true)` is acceptable because the data is intentionally public/shared (single-tenant, no auth).

3. Notes
- The life_calendar table stores a single row (the user's birth date and life expectancy).
- week_notes stores per-week annotations keyed by a 0-based week index.
- The unique constraint prevents duplicate notes for the same week.
*/

CREATE TABLE IF NOT EXISTS life_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_date date NOT NULL,
  life_expectancy int NOT NULL DEFAULT 80,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE life_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_life_calendar" ON life_calendar;
CREATE POLICY "anon_select_life_calendar" ON life_calendar FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_life_calendar" ON life_calendar;
CREATE POLICY "anon_insert_life_calendar" ON life_calendar FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_life_calendar" ON life_calendar;
CREATE POLICY "anon_update_life_calendar" ON life_calendar FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_life_calendar" ON life_calendar;
CREATE POLICY "anon_delete_life_calendar" ON life_calendar FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS week_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id uuid NOT NULL REFERENCES life_calendar(id) ON DELETE CASCADE,
  week_index int NOT NULL,
  note text,
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(calendar_id, week_index)
);

ALTER TABLE week_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_week_notes" ON week_notes;
CREATE POLICY "anon_select_week_notes" ON week_notes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_week_notes" ON week_notes;
CREATE POLICY "anon_insert_week_notes" ON week_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_week_notes" ON week_notes;
CREATE POLICY "anon_update_week_notes" ON week_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_week_notes" ON week_notes;
CREATE POLICY "anon_delete_week_notes" ON week_notes FOR DELETE
  TO anon, authenticated USING (true);

-- Index for faster lookups by calendar
CREATE INDEX IF NOT EXISTS idx_week_notes_calendar_id ON week_notes(calendar_id);
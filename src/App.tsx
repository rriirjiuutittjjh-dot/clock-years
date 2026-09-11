import { useState, useEffect, useCallback } from 'react'
import { supabase, type LifeCalendar, type WeekNote } from './lib/supabase'
import Onboarding from './components/Onboarding'
import LifeGrid from './components/LifeGrid'
import WeekModal from './components/WeekModal'
import LoadingScreen from './components/LoadingScreen'

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#f97316',
]

export default function App() {
  const [calendar, setCalendar] = useState<LifeCalendar | null>(null)
  const [weekNotes, setWeekNotes] = useState<WeekNote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const loadCalendar = useCallback(async () => {
    const { data, error } = await supabase
      .from('life_calendar')
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Error loading calendar:', error)
      return
    }

    setCalendar(data as LifeCalendar | null)

    if (data) {
      const { data: notes, error: notesError } = await supabase
        .from('week_notes')
        .select('*')
        .eq('calendar_id', data.id)

      if (notesError) {
        console.error('Error loading notes:', notesError)
        return
      }

      setWeekNotes(notes as WeekNote[])
    }
  }, [])

  useEffect(() => {
    loadCalendar().finally(() => setLoading(false))
  }, [loadCalendar])

  const handleOnboard = async (birthDate: string, lifeExpectancy: number) => {
    const { data, error } = await supabase
      .from('life_calendar')
      .insert({ birth_date: birthDate, life_expectancy: lifeExpectancy })
      .select()
      .single()

    if (error) {
      console.error('Error creating calendar:', error)
      return
    }

    setCalendar(data as LifeCalendar)
  }

  const handleUpdateSettings = async (birthDate: string, lifeExpectancy: number) => {
    if (!calendar) return

    const { data, error } = await supabase
      .from('life_calendar')
      .update({ birth_date: birthDate, life_expectancy: lifeExpectancy, updated_at: new Date().toISOString() })
      .eq('id', calendar.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating calendar:', error)
      return
    }

    setCalendar(data as LifeCalendar)
  }

  const handleSaveNote = async (weekIndex: number, note: string, color: string) => {
    if (!calendar) return

    const existing = weekNotes.find((n) => n.week_index === weekIndex)

    if (existing) {
      const { data, error } = await supabase
        .from('week_notes')
        .update({ note, color, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating note:', error)
        return
      }

      setWeekNotes((prev) =>
        prev.map((n) => (n.id === existing.id ? (data as WeekNote) : n)),
      )
    } else {
      const { data, error } = await supabase
        .from('week_notes')
        .insert({
          calendar_id: calendar.id,
          week_index: weekIndex,
          note,
          color,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating note:', error)
        return
      }

      setWeekNotes((prev) => [...prev, data as WeekNote])
    }
  }

  const handleDeleteNote = async (weekIndex: number) => {
    const existing = weekNotes.find((n) => n.week_index === weekIndex)
    if (!existing) return

    const { error } = await supabase
      .from('week_notes')
      .delete()
      .eq('id', existing.id)

    if (error) {
      console.error('Error deleting note:', error)
      return
    }

    setWeekNotes((prev) => prev.filter((n) => n.id !== existing.id))
  }

  if (loading) return <LoadingScreen />

  if (!calendar) {
    return <Onboarding onComplete={handleOnboard} />
  }

  const selectedNote = selectedWeek !== null
    ? weekNotes.find((n) => n.week_index === selectedWeek) ?? null
    : null

  return (
    <div className="app">
      <LifeGrid
        calendar={calendar}
        weekNotes={weekNotes}
        colors={COLORS}
        onWeekClick={setSelectedWeek}
        onUpdateSettings={handleUpdateSettings}
      />
      {selectedWeek !== null && (
        <WeekModal
          weekIndex={selectedWeek}
          calendar={calendar}
          existingNote={selectedNote}
          colors={COLORS}
          onClose={() => setSelectedWeek(null)}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
        />
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import type { LifeCalendar, WeekNote } from '../lib/supabase'
import SettingsModal from './SettingsModal'

interface Props {
  calendar: LifeCalendar
  weekNotes: WeekNote[]
  colors: string[]
  onWeekClick: (weekIndex: number) => void
  onUpdateSettings: (birthDate: string, lifeExpectancy: number) => void
}

export default function LifeGrid({ calendar, weekNotes, onWeekClick, onUpdateSettings }: Props) {
  const [showSettings, setShowSettings] = useState(false)

  const birthDate = new Date(calendar.birth_date)
  const today = new Date()
  const totalWeeks = calendar.life_expectancy * 52
  const weeksLived = Math.max(0, Math.floor((today.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000)))
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived)
  const yearsLived = Math.floor(weeksLived / 52)
  const percentLived = Math.round((weeksLived / totalWeeks) * 100)

  const notesMap = useMemo(() => {
    const map = new Map<number, WeekNote>()
    for (const note of weekNotes) {
      map.set(note.week_index, note)
    }
    return map
  }, [weekNotes])

  const rows = useMemo(() => {
    const result: number[][] = []
    for (let y = 0; y < calendar.life_expectancy; y++) {
      const row: number[] = []
      for (let w = 0; w < 52; w++) {
        row.push(y * 52 + w)
      }
      result.push(row)
    }
    return result
  }, [calendar.life_expectancy])

  return (
    <>
      <div className="app-header">
        <div className="brand">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h1>Clock Years</h1>
        </div>
        <button className="btn-secondary" onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <div className="label">Weeks Lived</div>
          <div className="value">{weeksLived.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="label">Weeks Remaining</div>
          <div className="value">{weeksRemaining.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="label">Years Lived</div>
          <div className="value">{yearsLived}</div>
        </div>
        <div className="stat">
          <div className="label">Progress</div>
          <div className="value">{percentLived}<span className="unit">%</span></div>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-wrapper">
          <div className="y-axis">
            {rows.map((_, y) => (
              <div key={y} className="y-label">{y}</div>
            ))}
          </div>
          <div className="week-grid">
            {rows.map((row, y) => (
              <div key={y} className="week-row">
                {row.map((weekIndex) => {
                  const isPast = weekIndex < weeksLived
                  const isCurrent = weekIndex === weeksLived
                  const note = notesMap.get(weekIndex)
                  const hasNote = !!note
                  const bgColor = note ? note.color : isPast ? '#3a3a48' : 'var(--bg-elevated)'

                  return (
                    <div
                      key={weekIndex}
                      className={`week-cell ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''} ${hasNote ? 'has-note' : ''}`}
                      style={{ background: bgColor }}
                      onClick={() => onWeekClick(weekIndex)}
                      title={note?.note || `Week ${weekIndex + 1}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#3a3a48' }} />
            <span>Weeks Lived</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
            <span>Weeks Ahead</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
            <span>This Week</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#3b82f6' }} />
            <span>Has Note</span>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          calendar={calendar}
          onClose={() => setShowSettings(false)}
          onSave={onUpdateSettings}
        />
      )}
    </>
  )
}

import { useState, useEffect } from 'react'
import type { LifeCalendar, WeekNote } from '../lib/supabase'

interface Props {
  weekIndex: number
  calendar: LifeCalendar
  existingNote: WeekNote | null
  colors: string[]
  onClose: () => void
  onSave: (weekIndex: number, note: string, color: string) => void
  onDelete: (weekIndex: number) => void
}

export default function WeekModal({
  weekIndex,
  calendar,
  existingNote,
  colors,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [note, setNote] = useState('')
  const [color, setColor] = useState(colors[0])

  useEffect(() => {
    if (existingNote) {
      setNote(existingNote.note || '')
      setColor(existingNote.color)
    } else {
      setNote('')
      setColor(colors[0])
    }
  }, [existingNote, colors])

  const birthDate = new Date(calendar.birth_date)
  const weekStart = new Date(birthDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000)
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const yearAge = Math.floor(weekIndex / 52)
  const weekInYear = (weekIndex % 52) + 1

  const handleSave = () => {
    onSave(weekIndex, note, color)
    onClose()
  }

  const handleDelete = () => {
    onDelete(weekIndex)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Age {yearAge}, Week {weekInYear}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="date-info">
          {formatDate(weekStart)} — {formatDate(weekEnd)}
        </div>
        <textarea
          placeholder="Write a note for this week..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
        />
        <div className="color-picker">
          {colors.map((c) => (
            <button
              key={c}
              className={`color-option ${c === color ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="modal-actions">
          {existingNote && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

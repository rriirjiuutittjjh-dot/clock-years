import { useState, useEffect } from 'react'
import type { LifeCalendar } from '../lib/supabase'

interface Props {
  calendar: LifeCalendar
  onClose: () => void
  onSave: (birthDate: string, lifeExpectancy: number) => void
}

export default function SettingsModal({ calendar, onClose, onSave }: Props) {
  const [birthDate, setBirthDate] = useState(calendar.birth_date)
  const [lifeExpectancy, setLifeExpectancy] = useState(calendar.life_expectancy)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSave = () => {
    if (!birthDate) {
      setError('Please enter a birth date.')
      return
    }

    const birth = new Date(birthDate)
    const today = new Date()
    if (birth > today) {
      setError('Birth date cannot be in the future.')
      return
    }

    if (lifeExpectancy < 1 || lifeExpectancy > 150) {
      setError('Life expectancy must be between 1 and 150.')
      return
    }

    onSave(birthDate, lifeExpectancy)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="form-group">
          <label htmlFor="settings-birth">Birth Date</label>
          <input
            id="settings-birth"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="settings-expectancy">Life Expectancy (years)</label>
          <input
            id="settings-expectancy"
            type="number"
            value={lifeExpectancy}
            min={1}
            max={150}
            onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 80)}
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="modal-actions" style={{ marginTop: 24 }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

interface Props {
  onComplete: (birthDate: string, lifeExpectancy: number) => void
}

export default function Onboarding({ onComplete }: Props) {
  const [birthDate, setBirthDate] = useState('')
  const [lifeExpectancy, setLifeExpectancy] = useState(80)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!birthDate) {
      setError('Please enter your birth date.')
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

    onComplete(birthDate, lifeExpectancy)
  }

  return (
    <div className="onboarding">
      <form className="onboarding-card" onSubmit={handleSubmit}>
        <div className="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1>Clock Years</h1>
        <p className="subtitle">
          See your entire life laid out as a grid of weeks. Each square is one week.
          Reflect on the past, plan for the future, and make every week count.
        </p>
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lifeExpectancy">Life Expectancy (years)</label>
          <input
            id="lifeExpectancy"
            type="number"
            value={lifeExpectancy}
            min={1}
            max={150}
            onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 80)}
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn-primary" style={{ marginTop: 24 }}>
          Visualize My Life
        </button>
      </form>
    </div>
  )
}

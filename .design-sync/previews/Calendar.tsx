import { Calendar } from 'reelease-ai'

export function SingleDate() {
  return (
    <div style={{ padding: 24 }}>
      <Calendar mode="single" selected={new Date(2026, 5, 15)} defaultMonth={new Date(2026, 5, 1)} />
    </div>
  )
}

export function Range() {
  return (
    <div style={{ padding: 24 }}>
      <Calendar
        mode="range"
        selected={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 16) }}
        defaultMonth={new Date(2026, 5, 1)}
      />
    </div>
  )
}

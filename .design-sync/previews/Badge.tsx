import { Badge } from 'reelease-ai'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
  padding: 24,
}

export function Variants() {
  return (
    <div style={row}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="premium">Premium</Badge>
      <Badge variant="glass">Glass</Badge>
    </div>
  )
}

export function Statuses() {
  return (
    <div style={row}>
      <Badge variant="premium">Published</Badge>
      <Badge variant="secondary">Scheduled</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  )
}

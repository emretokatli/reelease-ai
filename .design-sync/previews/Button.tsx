import { Button } from 'reelease-ai'
import { ArrowRight, Download, Plus, Trash2 } from 'lucide-react'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
  padding: 24,
}

export function Variants() {
  return (
    <div style={row}>
      <Button>Default</Button>
      <Button variant="premium">Premium</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="glass">Glass</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={row}>
      <Button size="sm" variant="premium">Small</Button>
      <Button size="default" variant="premium">Default</Button>
      <Button size="lg" variant="premium">Large</Button>
      <Button size="icon" variant="premium"><Plus /></Button>
    </div>
  )
}

export function WithIcons() {
  return (
    <div style={row}>
      <Button variant="premium"><Plus /> New post</Button>
      <Button variant="outline"><Download /> Export</Button>
      <Button variant="destructive"><Trash2 /> Remove</Button>
      <Button variant="link">Continue <ArrowRight /></Button>
    </div>
  )
}

export function States() {
  return (
    <div style={row}>
      <Button variant="premium">Enabled</Button>
      <Button variant="premium" disabled>Disabled</Button>
      <Button variant="outline" disabled>Unavailable</Button>
    </div>
  )
}

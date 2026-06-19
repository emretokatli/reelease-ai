import { Input, Label } from 'reelease-ai'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, padding: 24, maxWidth: 340 }

export function WithLabel() {
  return (
    <div style={col}>
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@company.com" />
    </div>
  )
}

export function States() {
  return (
    <div style={{ ...col, maxWidth: 360, gap: 12 }}>
      <Input placeholder="Empty input" />
      <Input defaultValue="Filled value" />
      <Input placeholder="Disabled" disabled />
    </div>
  )
}

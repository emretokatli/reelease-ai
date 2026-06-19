import { Input, Label } from 'reelease-ai'

export function FieldLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24, maxWidth: 320 }}>
      <Label htmlFor="handle">Account handle</Label>
      <Input id="handle" placeholder="@reelease" />
    </div>
  )
}

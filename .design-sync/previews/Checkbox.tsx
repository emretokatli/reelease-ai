import { Checkbox } from 'reelease-ai'

const item: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }

export function States() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24, flexWrap: 'wrap' }}>
      <label style={item}><Checkbox checked={false} /> Unchecked</label>
      <label style={item}><Checkbox checked /> Checked</label>
      <label style={item}><Checkbox indeterminate /> Indeterminate</label>
      <label style={{ ...item, opacity: 0.6 }}><Checkbox checked disabled /> Disabled</label>
    </div>
  )
}

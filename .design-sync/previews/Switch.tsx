import { Switch } from 'reelease-ai'

const item: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', fontSize: 14 }

export function States() {
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', padding: 24, flexWrap: 'wrap' }}>
      <label style={item}><Switch defaultChecked /> Enabled</label>
      <label style={item}><Switch /> Disabled feature</label>
      <label style={{ ...item, opacity: 0.5 }}><Switch defaultChecked disabled /> Locked</label>
    </div>
  )
}

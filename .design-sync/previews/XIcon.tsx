import { XIcon } from 'reelease-ai'

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
      <XIcon size={20} />
      <XIcon size={32} />
      <XIcon size={48} style={{ color: 'var(--primary)' }} />
    </div>
  )
}

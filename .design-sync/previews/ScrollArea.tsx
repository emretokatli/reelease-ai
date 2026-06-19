import { ScrollArea } from 'reelease-ai'

export function Notifications() {
  return (
    <div style={{ padding: 24 }}>
      <ScrollArea className="h-48 w-72 rounded-md border border-glass-border p-4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{ fontSize: 14, paddingBottom: 8, borderBottom: '1px solid var(--glass-border)' }}>
              New comment on post #{i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

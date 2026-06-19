import { Skeleton } from 'reelease-ai'

export function CardLoading() {
  return (
    <div style={{ padding: 24, display: 'flex', gap: 14, alignItems: 'center', width: 340 }}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

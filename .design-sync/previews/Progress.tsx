import { Progress } from 'reelease-ai'

export function Levels() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, width: 360 }}>
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={80} />
    </div>
  )
}

import { Slider } from 'reelease-ai'

export function Single() {
  return (
    <div style={{ padding: 32, width: 320 }}>
      <Slider defaultValue={[40]} max={100} step={1} />
    </div>
  )
}

export function Range() {
  return (
    <div style={{ padding: 32, width: 320 }}>
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  )
}

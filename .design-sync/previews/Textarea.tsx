import { Label, Textarea } from 'reelease-ai'

export function WithLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24, maxWidth: 400 }}>
      <Label>Caption</Label>
      <Textarea
        rows={4}
        defaultValue={'Behind the scenes of our summer shoot ☀️\nDrop a comment with your favorite look!'}
      />
    </div>
  )
}

export function Empty() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Textarea placeholder="Write a caption for your post..." rows={4} />
    </div>
  )
}

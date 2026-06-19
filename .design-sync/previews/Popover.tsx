import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'reelease-ai'

export function Settings() {
  return (
    <div style={{ padding: 24 }}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Export settings</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>Dimensions</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Set the export size.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label>Width</Label>
              <Input defaultValue="1080" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

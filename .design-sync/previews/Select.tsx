import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'reelease-ai'

export function Platform() {
  return (
    <div style={{ padding: 24, width: 280 }}>
      <Select defaultValue="instagram" defaultOpen>
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Platforms</SelectLabel>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

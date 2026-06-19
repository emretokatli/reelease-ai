import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'reelease-ai'

export function Posts() {
  return (
    <div style={{ padding: 24 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reach</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Summer launch reel</TableCell>
            <TableCell>Instagram</TableCell>
            <TableCell><Badge variant="premium">Published</Badge></TableCell>
            <TableCell>24,910</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Product teaser</TableCell>
            <TableCell>TikTok</TableCell>
            <TableCell><Badge variant="secondary">Scheduled</Badge></TableCell>
            <TableCell>—</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Behind the scenes</TableCell>
            <TableCell>LinkedIn</TableCell>
            <TableCell><Badge variant="outline">Draft</Badge></TableCell>
            <TableCell>—</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

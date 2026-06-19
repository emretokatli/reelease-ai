import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'reelease-ai'
import { TrendingUp } from 'lucide-react'

export function Default() {
  return (
    <div style={{ padding: 24, maxWidth: 380 }}>
      <Card>
        <CardHeader>
          <CardTitle>Publish to Instagram</CardTitle>
          <CardDescription>
            Schedule this reel to go live across your connected accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
            Your caption, hashtags and cover image are ready. Review before
            publishing to your 12.4k followers.
          </p>
        </CardContent>
        <CardFooter style={{ gap: 12 }}>
          <Button variant="premium">Schedule</Button>
          <Button variant="ghost">Save draft</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function StatTile() {
  return (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Card>
        <CardContent style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Total reach</span>
            <Badge variant="premium">+18%</Badge>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>84,920</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--green-success)', fontSize: 13 }}>
            <TrendingUp size={16} /> Up from last week
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function Glass() {
  return (
    <div style={{ padding: 24, maxWidth: 380 }}>
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Glass surface</CardTitle>
          <CardDescription>A translucent card variant for layered UI.</CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
            Uses backdrop blur over the app background.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

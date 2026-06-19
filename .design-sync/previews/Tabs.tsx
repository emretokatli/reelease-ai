import { Tabs, TabsContent, TabsList, TabsTrigger } from 'reelease-ai'

export function Default() {
  return (
    <div style={{ padding: 24, width: 440 }}>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div style={{ padding: 16, fontSize: 14, color: 'var(--muted-foreground)' }}>
            Your account overview and recent activity at a glance.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

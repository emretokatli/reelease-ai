import { PasswordInput } from 'reelease-ai'
import { Lock } from 'lucide-react'

export function Default() {
  return (
    <div style={{ padding: 24, maxWidth: 340 }}>
      <PasswordInput placeholder="Enter password" defaultValue="supersecret" icon={Lock} />
    </div>
  )
}

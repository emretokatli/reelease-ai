import { Avatar, AvatarFallback } from 'reelease-ai'

const row: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', padding: 24 }

export function Group() {
  return (
    <div style={row}>
      <Avatar><AvatarFallback>EM</AvatarFallback></Avatar>
      <Avatar><AvatarFallback style={{ background: 'var(--primary)', color: '#fff' }}>AK</AvatarFallback></Avatar>
      <Avatar><AvatarFallback style={{ background: 'var(--secondary)', color: '#fff' }}>JS</AvatarFallback></Avatar>
      <Avatar><AvatarFallback style={{ background: 'var(--green-success)', color: '#fff' }}>RT</AvatarFallback></Avatar>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={row}>
      <Avatar className="h-8 w-8"><AvatarFallback style={{ background: 'var(--primary)', color: '#fff', fontSize: 12 }}>S</AvatarFallback></Avatar>
      <Avatar><AvatarFallback style={{ background: 'var(--primary)', color: '#fff' }}>M</AvatarFallback></Avatar>
      <Avatar className="h-14 w-14"><AvatarFallback style={{ background: 'var(--primary)', color: '#fff' }}>L</AvatarFallback></Avatar>
    </div>
  )
}

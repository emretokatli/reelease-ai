import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reelease-ai'
import { CreditCard, LogOut, Settings, User } from 'lucide-react'

export function AccountMenu() {
  return (
    <div style={{ padding: 24 }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Account</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User /> Profile</DropdownMenuItem>
          <DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem>
          <DropdownMenuItem><Settings /> Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem><LogOut /> Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

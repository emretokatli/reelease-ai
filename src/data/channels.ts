import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'

export const availablePlatform = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect and manage Facebook pages within this workspace.',
    icon: Facebook,
    color: '#1877F2',
    type: 'Page',
    status: 'SETUP',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Connect and manage Instagram accounts within this workspace.',
    icon: Instagram,
    color: '#E4405F',
    type: 'Profile',
    status: 'SETUP',
  },
  {
    id: 'twitter',
    name: 'Twitter (X)',
    description: 'Connect and manage Twitter (X) accounts within this workspace.',
    icon: Twitter,
    color: '#1877F2',
    type: 'Profile',
    status: 'SETUP',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect and manage LinkedIn Profile or Pages within this workspace.',
    icon: Linkedin,
    color: '#0A66C2',
    type: 'Profile/Page',
    status: 'SETUP',
  },
]

export const channels = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
]

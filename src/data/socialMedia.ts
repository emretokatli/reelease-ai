import { ROUTES } from '@/constants/routes'
import { ChannelStatsPeriod } from '@/types/components/features'
import { PlatformConfig, StatItem } from '@/types/socialMedia'
import { CalendarCheck, CalendarClock, ChartNetwork, CheckCircle2, Circle, Clock, Eye, Facebook, FileText, Heart, ImageIcon, Instagram, Linkedin, Loader2, LucideIcon, Music2, Plug, Send, Share2, Sparkles, TrendingUp, X } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'

export const platforms: PlatformConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-600/30',
    description: 'Management protocols for Pages and community scale.',
    features: ['Pages', 'Groups', 'Analytics'],
    isAvailable: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    description: 'Visual engagement systems and business growth.',
    features: ['Business', 'Creator', 'Insights'],
    isAvailable: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/10',
    borderColor: 'border-blue-700/30',
    description: 'Professional networking and corporate brand presence.',
    features: ['Profile', 'Company Page', 'Professional Network'],
    isAvailable: true,
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    description: 'Real-time updates and micro-blogging engagement.',
    features: ['Tweets', 'Analytics', 'Real-time'],
    isAvailable: true,
  },
]

export const platformsConfig = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2', icon: Facebook, bg: 'bg-[#1877F2]' },
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#E1306C',
    icon: Instagram,
    bg: 'bg-gradient-to-tr from-[#FFB700] via-[#FF006B] to-[#AD00FF]',
  },
  { id: 'twitter', label: 'Twitter', color: '#000000', icon: Twitter, bg: 'bg-black border border-white/20' },
  { id: 'linkedin', label: 'Linkedin', color: '#0A66C2', icon: Linkedin, bg: 'bg-[#0A66C2]' },
  // { id: 'youtube', label: 'Youtube', color: '#FF0000', icon: Youtube, bg: 'bg-[#FF0000]' },
]

export const contentTypes = [
  { id: 'post', label: 'Post' },
  { id: 'story', label: 'Story' },
  { id: 'reel', label: 'Reel' },
]

export const statuses = [
  { id: 'all', label: 'All Statuses' },
  { id: 'published', label: 'Published' },
  { id: 'pending', label: 'Pending / Scheduled' },
  { id: 'failed', label: 'Failed' },
  { id: 'draft', label: 'Drafts' },
]

export const mockAccounts = [
  { id: 'm1', account_name: '@reel.ease', platform: 'instagram', account_type: 'Business', profile_picture: '' },
  { id: 'm2', account_name: '@marketing.hub', platform: 'instagram', account_type: 'Business', profile_picture: '' },
  { id: 'm3', account_name: '@brand.studio', platform: 'instagram', account_type: 'Creator', profile_picture: '' },

  { id: 'm4', account_name: 'ReelEase', platform: 'facebook', account_type: 'Page', profile_picture: '' },
  { id: 'm5', account_name: 'Marketing Hub', platform: 'facebook', account_type: 'Page', profile_picture: '' },
  { id: 'm6', account_name: 'Brand Studio', platform: 'facebook', account_type: 'Page', profile_picture: '' },

  {
    id: 'm7',
    account_name: 'ReelEase Company',
    platform: 'linkedin',
    account_type: 'Company Page',
    profile_picture: '',
  },
  { id: 'm8', account_name: 'Marketing Hub', platform: 'linkedin', account_type: 'Company Page', profile_picture: '' },

  { id: 'm9', account_name: '@reel_ease', platform: 'twitter', account_type: 'Profile', profile_picture: '' },
  { id: 'm10', account_name: '@marketing_hub', platform: 'twitter', account_type: 'Profile', profile_picture: '' },

  { id: 'm11', account_name: 'ReelEase', platform: 'youtube', account_type: 'Channel', profile_picture: '' },
  { id: 'm12', account_name: 'Marketing Hub', platform: 'youtube', account_type: 'Channel', profile_picture: '' },
]

export const  weekdayLabelsFull= ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
export const weekdayLabelsShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const hourSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
export const periodLabelKeys: Record<ChannelStatsPeriod, string> = {
  today: 'today',
  week: 'this_week',
  month: 'this_month',
  year: 'this_year',
  all: 'all_time',
}

export const platformColors: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
}

export const periods = [
  { value: 'month', labelKey: 'this_month', defaultLabel: 'This Month' },
  { value: 'week', labelKey: 'this_week', defaultLabel: 'This Week' },
  { value: 'year', labelKey: 'this_year', defaultLabel: 'This Year' },
  { value: 'all', labelKey: 'all_time', defaultLabel: 'All Time' },
]

export const platformIcons: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
}

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const fallbackStats = {
  totalAccounts: 0,
  accountsTrend: 0,
  totalPosts: 0,
  postsTrend: 0,
  publishedToday: 0,
  scheduledCount: 0,
  engagement30d: 0,
  engagementTrend: 0,
}

export const statItems: StatItem[] = [
  {
    key: 'totalAccounts',
    labelKey: 'connected_accounts',
    defaultLabel: 'Connected Accounts',
    icon: ChartNetwork,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'totalPosts',
    labelKey: 'total_posts',
    defaultLabel: 'Total Posts',
    icon: Send,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    key: 'publishedToday',
    labelKey: 'published_today',
    defaultLabel: 'Published Today',
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    key: 'scheduledCount',
    labelKey: 'scheduled',
    defaultLabel: 'Scheduled',
    icon: CalendarClock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    key: 'engagement30d',
    labelKey: 'engagement_30d',
    defaultLabel: 'Engagement (30d)',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)),
  },
]

export const iconMap: Record<string, React.ComponentType<any>> = {
  Plug,
  Sparkles,
  FileText,
  CalendarCheck,
  Send,
}

export const stepRoutes: Record<string, string> = {
  connect: ROUTES.SOCIAL_MEDIA.CHANNELS,
  generate: '/dashboard',
  caption: ROUTES.SOCIAL_MEDIA.CAPTIONS,
  review: ROUTES.SOCIAL_MEDIA.COMPOSER,
  publish: ROUTES.SOCIAL_MEDIA.COMPOSER,
}

export const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
  },
  in_progress: {
    icon: Loader2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    animate: 'animate-spin',
  },
  pending: {
    icon: Circle,
    color: 'text-muted-foreground',
    bg: 'bg-black/5 dark:bg-white/5',
    border: 'border-black/10 dark:border-white/10',
  },
}

export const connectorAngles = [-135, -45, 45, 135] as const

export const platformNodes: {
  id: string
  position: string
  Icon: LucideIcon
  iconClassName?: string
}[] = [
  { id: 'instagram', position: 'left-[11%] top-[11%]', Icon: Instagram },
  { id: 'tiktok', position: 'right-[11%] top-[11%]', Icon: Music2, iconClassName: 'size-4' },
  { id: 'x', position: 'left-[11%] bottom-[11%]', Icon: X, iconClassName: 'size-4' },
  { id: 'facebook', position: 'right-[11%] bottom-[11%]', Icon: Facebook, iconClassName: 'size-4' },
]

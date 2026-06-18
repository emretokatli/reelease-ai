import { ROUTES } from '@/constants/routes'
import { CardConfig, ColorKey } from '@/types/layout'
import { Variants } from 'framer-motion'
import { Banknote, CreditCard, FileText, ImageIcon, LayoutTemplate, UserPlus, Users, Zap } from 'lucide-react'

export const colorMap: Record<ColorKey, { text: string; iconBg: string; progressBg: string; cardGradient: string }> = {
  blue: {
    text: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    progressBg: 'bg-blue-400',
    cardGradient: 'from-blue-400/5',
  },
  emerald: {
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    progressBg: 'bg-emerald-400',
    cardGradient: 'from-emerald-400/5',
  },
  amber: {
    text: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    progressBg: 'bg-amber-400',
    cardGradient: 'from-amber-400/5',
  },
  purple: {
    text: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    progressBg: 'bg-purple-400',
    cardGradient: 'from-purple-400/5',
  },
  indigo: {
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-400/10',
    progressBg: 'bg-indigo-400',
    cardGradient: 'from-indigo-400/5',
  },
}

export const cardConfigs: CardConfig[] = [
  {
    labelKey: 'total_registrations',
    defaultLabel: 'Total Registrations',
    descKey: 'global_user_reach',
    defaultDesc: 'Total registered users',
    statKey: 'totalUsers',
    icon: Users,
    color: 'blue',
    trend: '+12%',
    isLive: true,
  },
  {
    labelKey: 'new_this_week',
    defaultLabel: 'New Users this week',
    descKey: 'recent_growth',
    defaultDesc: 'Weekly user growth',
    statKey: 'thisWeekUsers',
    icon: UserPlus,
    color: 'emerald',
    trend: '+24%',
  },
  {
    labelKey: 'active_subscribers',
    defaultLabel: 'Active Subscribers',
    descKey: 'premium_loyalty',
    defaultDesc: 'Users with active paid subscriptions',
    statKey: 'totalSubscribers',
    icon: CreditCard,
    color: 'amber',
    trend: '+8%',
  },

  {
    labelKey: 'total_revenue',
    defaultLabel: 'Total Revenue',
    descKey: 'revenue_growth',
    defaultDesc: 'Overall revenue from subscriptions',
    statKey: 'totalRevenue',
    icon: Banknote,
    color: 'emerald',
    trend: '+18%',
  },
]

export const userDashboardCardsConfig = [
  {
    labelKey: 'available_credits',
    descKey: 'ai_generation_power',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]',
    gradient: 'from-blue-500/50 via-blue-800/10 to-transparent',
    shadow: 'shadow-blue-500/20',
    glow: 'bg-blue-500/30',
    statKey: 'credits',
  },
]

export const dashboardColors = ['#7c3aed', '#95a4fc', '#ff9f43', '#ff5e57', '#10b981', '#06b6d4', '#f59e0b']

export const dashboardParentVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: 'easeOut',
      duration: 0.8,
    },
  },
}

export const dashboardItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const sparklesConfig = [
  {
    wrapperClass: 'absolute top-4 end-8 opacity-15 transition-opacity duration-700',
    iconClass: 'w-4 h-4 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-12 end-16 opacity-15 transition-opacity duration-700 delay-100',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-8 end-24 opacity-20 transition-opacity duration-700 delay-300',
    iconClass: 'w-3 h-3 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-15 end-30 opacity-15 transition-opacity duration-700 delay-100',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass: 'absolute bottom-16 end-16 opacity-30 transition-opacity duration-700 delay-500',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass:
      'absolute bottom-16 top-18 end-6 opacity-25 group-hover/card:opacity-60 transition-all duration-1000 group-hover/card:scale-125',
    iconClass: 'w-6 h-6 rotate-12',
  },
]

export const getCommonChartOptions = (isDark: boolean, t: any): any => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: {
      enabled: false,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
  },
  theme: { mode: isDark ? 'dark' : 'light' },
  grid: {
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 10, bottom: 0, left: 10 },
  },
  dataLabels: { enabled: false },
  tooltip: {
    enabled: true,
    theme: 'dark',
    followCursor: true,
    intersect: false,
    shared: true,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const isPie = ['pie', 'donut', 'polarArea'].includes(w.config.chart.type)
      const value = isPie
        ? series[seriesIndex]
        : series[seriesIndex]
          ? Array.isArray(series[seriesIndex])
            ? series[seriesIndex][dataPointIndex]
            : series[seriesIndex]
          : 0

      const name = isPie
        ? w.globals.labels[seriesIndex]
        : w.globals.labels[dataPointIndex] || w.config.series[seriesIndex].name

      const color = isPie
        ? w.config.colors[seriesIndex]
        : w.config.plotOptions?.bar?.distributed || w.config.distributed
          ? w.config.colors[dataPointIndex]
          : w.config.colors[seriesIndex]

      const isRevenue =
        String(name || '')
          .toLowerCase()
          .includes('revenue') ||
        String(w.config.series[seriesIndex]?.name || '')
          .toLowerCase()
          .includes('revenue') ||
        String(w.config.series[seriesIndex]?.name || '')
          .toLowerCase()
          .includes('financial')

      const formattedValue = isRevenue ? `$${(value || 0).toLocaleString()}` : (value || 0).toLocaleString()

      return `
          <div class="relative bg-white/95 dark:bg-input-background/95 border-[unset]  px-4 py-2 flex flex-col min-w-[100px] transition-all duration-300">
          <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full shadow-sm" style="background-color: ${color || 'var(--blue-highlight)'}"></div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest leading-none">${name || t('value')}</span>
          </div>
          <div class="flex items-baseline gap-1">
          <span class="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">${formattedValue}</span>
          </div>
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-input-background/95 rotate-45 border-b border-slate-200 dark:border-white/10"></div>
          </div>
          `
    },
  },
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    crosshairs: { show: false },
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        fontSize: '11px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        fontSize: '11px',
      },
    },
  },
})

export const formatChartData = (data: Record<string, number> | undefined) => {
  const entries = Object.entries(data || {})
  return {
    names: entries.map(([name]) => name),
    values: entries.map(([_, value]) => value),
  }
}

export const routeMap: Record<string, string> = {
  totalUsers: ROUTES.MEMBERS,
  thisWeekUsers: ROUTES.MEMBERS,
  totalSubscribers: ROUTES.SUBSCRIPTIONS,

  totalRevenue: ROUTES.TRANSACTIONS,
}

export const count = [1, 2, 3, 4]

export const adminStatsConfig = [
  {
    key: 'totalUsers',
    labelKey: 'total_users',
    defaultLabel: 'Total Users',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'activeSubscribers',
    labelKey: 'active_subscribers',
    defaultLabel: 'Active Subscribers',
    icon: CreditCard,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    key: 'totalRevenue',
    labelKey: 'total_revenue',
    defaultLabel: 'Total Revenue',
    icon: Banknote,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    prefix: '$',
  },
  {
    key: 'totalBlogs',
    labelKey: 'total_blogs',
    defaultLabel: 'Total Blogs',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    key: 'totalMedia',
    labelKey: 'total_media',
    defaultLabel: 'Total Media',
    icon: ImageIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    key: 'totalPublishedPost',
    labelKey: 'total_published_posts',
    defaultLabel: 'Total Posts',
    icon: LayoutTemplate,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
]


export const featureRoutes: Record<string, string> = {
  image: ROUTES.TEXT_TO_IMAGE,
  images: ROUTES.IMAGE_TO_IMAGE,
  move: ROUTES.VIDEO_MOTION,
  video: ROUTES.TEXT_TO_VIDEO,
  clapperboard: ROUTES.IMAGE_TO_VIDEO,
}

export const adminDashboardItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

'use client'

import { motion, Variants } from 'framer-motion'
import { AdminDashboardProps } from '@/types/components/dashboard'
import { DashboardWelcome } from './components/DashboardWelcome'
import { Card } from '@/components/ui/card'
import { Users, CreditCard, Banknote, FileText, Image as ImageIcon, LayoutTemplate, Zap, Video, Calendar, Sparkle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { RevenueChart } from './components/RevenueChart'
import { RecentSocialActivity } from './components/RecentSocialActivity'
import { PopularFeaturesChart } from './components/PopularFeaturesChart'
import { RecentActivity } from './RecentActivity'
import Link from 'next/link'
import Image, { default as NextImage } from 'next/image'
import { getMediaUrl } from '@/utils'
import { Badge } from '@/components/ui/badge'
import { AdminDashboardStats } from '@/types'
import { ROUTES } from '@/constants/routes'
import { adminDashboardItemVariants, adminStatsConfig } from '@/data/dashboard'
import { StatsCards } from '@/components/feature/social-media/dashboard/StatsCards'
import { ConnectedAccounts } from '@/components/feature/social-media/dashboard/ConnectedAccounts'
import { UpcomingPosts } from '@/components/feature/social-media/dashboard/UpcomingPosts'
import { ChannelWiseChart } from '@/components/feature/social-media/dashboard/ChannelWiseChart'
import { TopEngagementPosts } from '@/components/feature/social-media/dashboard/TopEngagementPosts'
import { useGetSocialDashboardQuery } from '@/redux/api/socialApi'


export const AdminDashboard = ({ stats }: { stats: AdminDashboardStats }) => {
  const { t } = useTranslation()
  const parentVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: 'easeOut', duration: 0.8 },
    },
  }

  const statistics = stats?.statistics || {}
  const charts = stats?.charts || {}
  const activities = stats?.recentActivities || {}

  const { data: socialData } = useGetSocialDashboardQuery()
  const socialDashboard = socialData?.data || {}
  const fallbackStats = {
    totalAccounts: 0, accountsTrend: 0, totalPosts: 0, postsTrend: 0,
    publishedToday: 0, scheduledCount: 0, engagement30d: 0, engagementTrend: 0
  }

  return (
    <motion.div variants={parentVariants} initial="hidden" animate="show" className="space-y-6 lg:space-y-10 relative">
      {/* Row 1: Welcome Card + Stats Cards */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
        <div className="2xl:col-span-6 h-auto min-h-[250px] sm500:min-h-[200px] lg:h-[256px]">
          <DashboardWelcome />
        </div>
        <div className="2xl:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6 h-full">
            {adminStatsConfig.map((item, index) => {
              const value = statistics[item.key] || 0
              return (
                <motion.div key={index} variants={adminDashboardItemVariants} className="h-full">
                  <Card className="p-4 glass-card border! border-black!  gradient-border rounded-radius! transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 group h-full flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn('p-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6', item.bg, item.color)}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-subtitle-color dark:text-white/70 mb-1">
                          {t(item.labelKey, { defaultValue: item.defaultLabel })}
                        </p>
                        <h4 className="text-2xl font-medium tracking-normal text-title-color  dark:text-white transition-all">
                          {item.prefix}
                          {value.toLocaleString()}
                        </h4>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <motion.div variants={adminDashboardItemVariants}>
        <ConnectedAccounts accounts={socialDashboard.accounts || []} />
      </motion.div>

      {/* Stats Cards (Platforms activities) */}
      <motion.div variants={adminDashboardItemVariants}>
        <StatsCards stats={socialDashboard.stats || fallbackStats} />
      </motion.div>

      {/* Row 2: Revenue Chart + Recent Social Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={adminDashboardItemVariants} className="lg:col-span-8 min-h-[400px] lg:h-[450px]">
          <RevenueChart data={charts.revenuePerMonth || []} isDark={true} />
        </motion.div>
        <motion.div variants={adminDashboardItemVariants} className="lg:col-span-4 min-h-[400px] lg:h-[450px]">
          <RecentSocialActivity activities={activities.recentSocialActivity || []} />
        </motion.div>
      </div>

      {/* Row 3: Recent Users Table + Popular AI Features Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={adminDashboardItemVariants} className="lg:col-span-6 min-h-[400px] lg:h-[450px]">
          <RecentActivity recentUsers={activities.recentUsers || []} />
        </motion.div>
        <motion.div variants={adminDashboardItemVariants} className="lg:col-span-6 min-h-[400px] lg:h-[450px]">
          <PopularFeaturesChart data={charts.serviceUsagePieChart || []} isDark={true} />
        </motion.div>
      </div>

      {/* Social Media Activities: Upcoming Posts | Channel wise Posts | Top Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div variants={adminDashboardItemVariants}>
          <UpcomingPosts posts={socialDashboard.upcomingPosts || []} />
        </motion.div>
        <motion.div variants={adminDashboardItemVariants}>
          <ChannelWiseChart channelData={socialDashboard.channelData || []} />
        </motion.div>
        <motion.div variants={adminDashboardItemVariants}>
          <TopEngagementPosts posts={socialDashboard.topEngagementPosts || []} />
        </motion.div>
      </div>

      {/* Row 4: Recent AI Templates */}
      <motion.section variants={adminDashboardItemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-title-color dark:text-white flex items-center gap-2 pb-0">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkle className=" w-5 h-5 text-primary" />
            </div>
            {t('recent_ai_templates', { defaultValue: 'Recent AI Templates' })}
          </h2>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activities.recentTemplates || []).slice(0, 5).map((template: any, index: number) => (
            <Link key={index} href={`${ROUTES.AI_TEMPLATES}`}>
              <Card className="overflow-hidden hover-gradient-border group cursor-pointer hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
                <div className="relative h-60 overflow-hidden dark:bg-black/20 bg-white/10">
                  {template.type === 'video' ? (
                    <video
                      src={getMediaUrl(template.attachment_id?.file_path)}
                      className="w-full h-full object-cover  rounded-border-radius group-hover:scale-95 transition-transform duration-700"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={getMediaUrl(template.attachment_id?.file_path) || '/images/placeholder.png'}
                      alt={template.title}
                      fill unoptimized
                      className="object-cover group-hover:scale-95 rounded-border-radius transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0  group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-3 left-4 right-3">
                    <Badge className="bg-primary/20 backdrop-blur-md text-primary border-primary/20  text-xs font-medium px-3 py-1 mb-2">
                      {template.category_id?.name || t('uncategorized')}
                    </Badge>
                    <h3 className="dark:text-white text-black font-bold text-sm xl:text-lg leading-tight line-clamp-1">
                      {template.title}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-lg">
                    {template.type === 'video' ? (
                      <Video className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}

'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { socialPublishApi, useDeletePostMutation, useGetPostHistoryQuery } from '@/redux/api/socialPublishApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { formatDateTime, getMediaUrl } from '@/utils'
import {
  CalendarClock, Clock, Edit3,
  Facebook,
  Instagram, Linkedin, Plus, Share2,
  Trash2
} from 'lucide-react'

import { XIcon as Twitter } from '@/components/ui/XIcon'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

function getCountdown(scheduledAt: string) {
  const now = new Date().getTime()
  const target = new Date(scheduledAt).getTime()
  const diff = target - now
  if (diff <= 0) return null
  const hrs = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  return { hrs, mins, secs }
}

function CountdownTimer({ scheduledAt }: { scheduledAt: string }) {
  const [countdown, setCountdown] = useState(getCountdown(scheduledAt))
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(scheduledAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [scheduledAt])
  if (!countdown) return <span className="text-emerald-400 font-bold text-xs">Publishing soon...</span>
  return (
    <div className="flex items-center gap-1 font-mono text-xs font-bold">
      <span className="bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-500/20">
        {String(countdown.hrs).padStart(2, '0')}h
      </span>
      <span className="text-muted-foreground/30">:</span>
      <span className="bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-500/20">
        {String(countdown.mins).padStart(2, '0')}m
      </span>
      <span className="text-muted-foreground/30">:</span>
      <span className="bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-500/20">
        {String(countdown.secs).padStart(2, '0')}s
      </span>
    </div>
  )
}

export default function ScheduledPostsContent() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: historyData, isLoading, refetch } = useGetPostHistoryQuery({
    page: 1,
    limit: 100,
    status: 'scheduled',
  })

  // Real-time updates via socket
  useEffect(() => {
    if (!user) return
    const userId = user?._id || user?.id
    if (!userId) return
    const eventName = `social-post-${userId}`
    const handlePostUpdate = () => {
      dispatch(socialPublishApi.util.invalidateTags(['SocialPost']))
      refetch()
    }
    socket.on(eventName, handlePostUpdate)
    return () => { socket.off(eventName, handlePostUpdate) }
  }, [user, dispatch, refetch])

  const [deletePost] = useDeletePostMutation()

  const scheduledPosts = (historyData?.data || []).filter((p: any) =>
    p.status === 'scheduled' || (p.status === 'pending' && p.scheduled_at)
  ).sort((a: any, b: any) =>
    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  )

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePost(deleteId).unwrap()
      toast.success(t('post_deleted_successfully', { defaultValue: 'Post deleted successfully' }))
      setDeleteId(null)
    } catch (error: any) {
      toast.error(error.data?.message || t('failed_to_delete_post', { defaultValue: 'Failed to delete post' }))
    }
  }

  const PlatformBadge = ({ platform }: { platform: string }) => {
    const configs: Record<string, { icon: React.ReactNode; bg: string }> = {
      facebook: { icon: <Facebook className="w-3 h-3 text-white" />, bg: 'bg-[#1877F2]' },
      linkedin: { icon: <Linkedin className="w-3 h-3 text-white" />, bg: 'bg-[#0A66C2]' },
      twitter: { icon: <Twitter className="w-3 h-3 text-white" />, bg: 'bg-black border border-white/10' },
      instagram: { icon: <Instagram className="w-3 h-3 text-white" />, bg: 'bg-gradient-to-tr from-[#FFB700] via-[#FF006B] to-[#AD00FF]' },
    }
    const cfg = configs[platform] || configs.instagram
    return (
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${cfg.bg}`}>
        {cfg.icon}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-1">
      <PageHeader
        icon={<CalendarClock className="w-6 h-6 text-primary animate-pulse" />}
        title={t('scheduled_posts')}
        subtitle={t('scheduled_posts_desc', { defaultValue: 'Manage your scheduled posts' })}
        showBackButton={false}
        endContent={
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.SOCIAL_MEDIA.COMPOSER)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl primary-btn text-white! text-sm font-medium hover:bg-white/10 transition-all h-auto"
          >
            <Plus className="w-4 h-4" />
            {t('new_post', { defaultValue: 'New Post' })}
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6">
        <div className="glass-card rounded-border-radius hover-gradient-border border border-glass-border bg-white dark:bg-white/3 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-title-color dark:text-white">{scheduledPosts.length}</p>
            <p className="text-xs text-muted-foreground">{t('total_scheduled', { defaultValue: 'Total Scheduled' })}</p>
          </div>
        </div>
        <div className="glass-card rounded-border-radius hover-gradient-border border border-glass-border bg-white dark:bg-white/3 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-title-color dark:text-white">
              {scheduledPosts.filter((p: any) => new Date(p.scheduled_at) > new Date()).length}
            </p>
            <p className="text-xs text-muted-foreground">{t('upcoming', { defaultValue: 'Upcoming' })}</p>
          </div>
        </div>
        <div className="glass-card rounded-border-radius hover-gradient-border border border-glass-border bg-white dark:bg-white/3 p-5 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-black text-title-color dark:text-white">{new Set(scheduledPosts.map((p: any) => p.platform)).size}</p>
            <p className="text-xs text-muted-foreground">{t('platforms', { defaultValue: 'Platforms' })}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[380px] rounded-2xl bg-black/3 dark:bg-white/3 border border-glass-border animate-pulse" />
          ))}
        </div>
      ) : scheduledPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 border  border-glass-border rounded-3xl bg-white dark:bg-white/3">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-5 ring-2 ring-yellow-500/20">
            <CalendarClock className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-xl font-black text-title-color dark:text-white mb-2">
            {t('no_scheduled_posts', { defaultValue: 'No Scheduled Posts' })}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            {t('no_scheduled_desc', {
              defaultValue: 'Schedule your first post to see it here. Posts will auto-publish at your chosen time.',
            })}
          </p>
          <Link href="/social-media/composer">
            <Button className="gap-2 primary-btn text-white! font-bold rounded-xl">
              <Plus className="w-4 h-4" />
              {t('schedule_post', { defaultValue: 'Schedule a Post' })}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scheduledPosts.map((post: any) => (
            <div
              key={post.id || post._id}
              className="group rounded-2xl border border-yellow-500/20 dark:border-yellow-500/20 bg-black/3 dark:bg-white/3 overflow-hidden hover:border-yellow-400/40 transition-all duration-300 glass-card flex flex-col"
            >
              {/* Countdown Banner */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-yellow-500/5 border-b border-yellow-500/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-black text-yellow-400">Scheduled</span>
                </div>
                <CountdownTimer scheduledAt={post.scheduled_at} />
              </div>

              {/* Media Preview */}
              <div className="relative h-48 bg-black/15 dark:bg-white/3">
                <style>{`
                  .sched-swiper .swiper-button-next,
                  .sched-swiper .swiper-button-prev {
                    color: white !important;
                    transform: scale(0.45);
                    background: transparent;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    margin-top: -20px;
                  }
                  .sched-swiper:hover .swiper-button-next,
                  .sched-swiper:hover .swiper-button-prev { opacity: 1; }
                  .sched-swiper .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.5);
                    width: 5px; height: 5px;
                  }
                  .sched-swiper .swiper-pagination-bullet-active { background: white; }
                `}</style>
                {post.media_urls?.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full h-full sched-swiper"
                    style={{ height: '100%' }}
                  >
                    {post.media_urls.map((url: string, idx: number) => {
                      const isVid = url.includes('.mp4')
                      return (
                        <SwiperSlide key={idx} style={{ height: '100%' }}>
                          <div className="relative w-full h-full">
                            {isVid ? (
                              <video
                                src={getMediaUrl(url)}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onMouseEnter={(e) => e.currentTarget.play().catch(() => { })}
                                onMouseLeave={(e) => {
                                  e.currentTarget.pause()
                                  e.currentTarget.currentTime = 0
                                }}
                              />
                            ) : (
                              <Image src={getMediaUrl(url) || ''} alt="" fill unoptimized className="object-cover" />
                            )}
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-title-color dark:text-white">
                    <Share2 className="w-8 h-8" />
                    <span className="text-xs text-subtitle-color mt-2">Text only</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Account + Platform */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {post.account?.profile_picture ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-glass-border">
                        <Image src={post.account.profile_picture} alt="" fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1">
                      <PlatformBadge platform={post.platform} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-title-color dark:text-white truncate">{post.account?.account_name || 'Unknown'}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{post.content_type}</p>
                  </div>
                  <Badge className="text-[12px] bg-yellow-500/10 text-yellow-400 border-yellow-500/20 capitalize px-1.5">
                    {post.status}
                  </Badge>
                </div>

                {/* Caption */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  {post.caption || 'No caption'}
                </p>

                {/* Schedule date/time */}
                <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(post.scheduled_at)}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-glass-border bg-black/2 dark:bg-white/2">
                <span className="text-xs text-subtitle-color">
                  {post.media_urls?.length || 0} {t('media', { defaultValue: 'media' })}
                </span>
                <div className="flex items-center gap-1">
                  <Link href={`/social-media/composer?postId=${post.id || post._id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                      title="Edit post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
                    onClick={() => setDeleteId(post.id || post._id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        // isDeleting={isDeleting}
        title={t('delete_post', { defaultValue: 'Delete Scheduled Post' })}
        description={t('delete_post_desc', {
          defaultValue: 'Are you sure you want to delete this scheduled post? This action cannot be undone.',
        })}
      />
    </div>
  )
}

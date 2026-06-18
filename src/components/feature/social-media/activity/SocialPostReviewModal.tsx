'use client'

import { Facebook, Instagram, Linkedin, ExternalLink, X, AlertTriangle, Clock, Share2 } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { Button } from '@/components/ui/button'
import { NetworkPreview } from '../publish/NetworkPreview'
import { formatDate, getMediaUrl } from '@/utils'
import { SocialPostReviewModalProps } from '@/types/socialMedia'


export function SocialPostReviewModal({ post, t, onClose, getPostLink }: SocialPostReviewModalProps) {

  if (!post) return null

  const postUrl = getPostLink(post)
  const isStory = post.content_type === 'story'
  const profileUrl = post.platform === 'instagram'
    ? `https://instagram.com/${post.account?.account_username || post.account?.account_name}`
    : post.platform === 'facebook'
      ? `https://facebook.com/${post.account?.account_username || post.account?.account_name}`
      : post.platform === 'linkedin'
        ? `https://linkedin.com`
        : `https://twitter.com/${post.account?.account_username || post.account?.account_name}`

  const targetUrl = isStory ? profileUrl : postUrl

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-light-body border border-glass-border rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between sm:p-6 p-4 border-b border-glass-border gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[12px] font-bold text-primary">
              {t('preview_post', { defaultValue: 'Social Post Review' })}
            </span>
            <h3 className="sm:text-xl text-base font-bold text-foreground flex items-center gap-2 flex-wrap">
              {post.platform === 'facebook' ? (
                <Facebook className="w-5 h-5 text-[#1877F2] shrink-0" />
              ) : post.platform === 'linkedin' ? (
                <Linkedin className="w-5 h-5 text-[#0A66C2] shrink-0" />
              ) : post.platform === 'twitter' || post.platform === 'x' ? (
                <Twitter className="w-5 h-5 text-foreground shrink-0" />
              ) : (
                <Instagram className="w-5 h-5 text-pink-500 shrink-0" />
              )}
              <span className="truncate">{post.platform?.toUpperCase()} {t('published_overview', { defaultValue: 'Post Overview' })}</span>
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {post.account?.account_name} &bull; @{post.account?.account_username || post.account?.account_name}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Post Button */}
            {post.status === 'published' && targetUrl ? (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-xl primary-btn text-white! font-bold h-9 sm:h-10 px-3 sm:px-4 hover:scale-105 transition-all flex items-center gap-2 text-xs sm:text-sm">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {isStory
                      ? t('view_story_button', { defaultValue: 'View Story' })
                      : t('view_post_button', { defaultValue: 'View Post' })}
                  </span>
                </Button>
              </a>
            ) : (
              <Button
                disabled
                className="rounded-xl primary-btn text-white! border border-white/10 h-9 sm:h-10 px-3 sm:px-4 flex items-center gap-2 text-xs sm:text-sm"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">
                  {post.status === 'scheduled' ? t('scheduled_post_btn', { defaultValue: 'Scheduled' }) : t('unavailable', { defaultValue: 'Unavailable' })}
                </span>
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="border-[unset]! bg-[unset]!  shrink-0 text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto sm:p-6 p-4 no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

            {/* Left side: Premium Authentic Network Preview with Swiper support */}
            <div className="lg:col-span-7">
              <NetworkPreview
                account={post.account}
                caption={post.caption}
                mediaList={post.media_urls?.map((url: string) => ({
                  file_path: url,
                  mime_type: url.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
                }))}
                activeTab={isStory ? 'story' : 'feed'}
                storyText={post.storyText || ''}
                storyTextColor={post.storyTextColor || '#ffffff'}
                storyTextBg={post.storyTextBg || 'rgba(0,0,0,0.6)'}
                storyTextSize={post.storyTextSize || 'md'}
                storyTextPosition={post.storyTextPosition || 'center'}
                selectedMusic={post.selectedMusic ? { name: post.selectedMusic, url: '' } : null}
              />
            </div>

            {/* Right side: Detailed Metadata card info */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${post.status === 'published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                post.status === 'failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  post.status === 'scheduled' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-black/3 dark:bg-white/5 border-glass-border text-muted-foreground'
                }`}>
                {post.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : post.status === 'scheduled' ? (
                  <Clock className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <Share2 className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider">{t('publishing_status', { defaultValue: 'Publishing Status' })}</h4>
                  <p className="text-sm font-semibold capitalize">{t(post.status || 'pending')}</p>
                  {post.error_message && (
                    <p className="text-[11px] font-mono mt-1 opacity-90 break-words leading-relaxed">
                      {post.error_message}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta Details Card */}
              <div className="rounded-2xl border border-glass-border bg-black/3 dark:bg-white/2 p-4 sm:p-5 space-y-4 shadow-xl">
                <h4 className="text-sm font-black text-primary border-b border-glass-border pb-2">{t('meta_information', { defaultValue: 'Metadata Information' })}</h4>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-[13px] text-muted-foreground font-black block">{t('platform', { defaultValue: 'Platform' })}</span>
                    <span className="text-xs font-bold text-foreground capitalize">{post.platform}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-muted-foreground font-black block">{t('format', { defaultValue: 'Format' })}</span>
                    <span className="text-xs font-bold text-foreground capitalize">{post.content_type || 'Feed Post'}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-muted-foreground font-black block">{t('created_date', { defaultValue: 'Created At' })}</span>
                    <span className="text-xs font-bold text-foreground">{formatDate(post.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-[13px] text-muted-foreground font-black block">
                      {post.status === 'scheduled' ? t('scheduled_at_label', { defaultValue: 'Scheduled At' }) : t('published_at_label', { defaultValue: 'Published At' })}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {post.scheduled_at ? formatDate(post.scheduled_at) : post.published_at ? formatDate(post.published_at) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-glass-border pt-4 space-y-2">
                  <span className="text-[13px] text-muted-foreground font-black block">{t('media_files', { defaultValue: 'Media Attachments' })}</span>
                  <p className="text-xs text-foreground">
                    {post.media_urls?.length || 0} {t('files_selected', { defaultValue: 'attached media files.' })}
                  </p>
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.media_urls.map((url: string, index: number) => (
                        <a
                          key={index}
                          href={getMediaUrl(url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg"
                        >
                          {t('file')} #{index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Facebook, Instagram, Linkedin, Heart, MessageCircle, Repeat2, Send, ThumbsUp, Share, MoreHorizontal, Globe } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { NetworkPreviewProps } from '@/types/socialMedia'

function PlatformAvatarFallback({ platform }: { platform?: string }) {
  const p = platform?.toLowerCase()
  if (p === 'instagram') return <Instagram className="w-4 h-4 text-white" />
  if (p === 'linkedin') return <Linkedin className="w-4 h-4 text-white" />
  if (p === 'twitter' || p === 'x') return <Twitter className="w-4 h-4 text-white" />
  if (p === 'facebook') return <Facebook className="w-4 h-4 text-white" />
  return <span className="text-[10px]">👤</span>
}

const getImageUrl = (path: string) => (path?.startsWith('http') ? path : `/${path?.replace(/^\//, '')}`)

const renderCaptionWithHashtags = (captionText: string, platform: string) => {
  if (!captionText) return 'Your caption will appear here...'

  // Regex to find hashtags: # followed by alphanumeric characters
  const hashtagRegex = /#(\w+)/g
  const parts = captionText.split(hashtagRegex)

  if (parts.length === 1) return captionText

  // Find matches
  const matches = Array.from(captionText.matchAll(hashtagRegex))
  let matchIndex = 0

  return parts.map((part, index) => {
    // Every odd index is a hashtag match
    if (index % 2 === 1) {
      const tag = part
      let url = '#'
      if (platform === 'instagram') {
        url = `https://www.instagram.com/explore/tags/${tag}/`
      } else if (platform === 'facebook') {
        url = `https://www.facebook.com/hashtag/${tag}`
      } else if (platform === 'linkedin') {
        url = `https://www.linkedin.com/feed/hashtag/?keywords=${tag}`
      } else if (platform === 'twitter') {
        url = `https://twitter.com/hashtag/${tag}`
      }

      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline font-semibold break-all whitesapce-normal "
          onClick={(e) => e.stopPropagation()}
        >
          #{tag}
        </a>
      )
    }
    return part
  })
}

function MusicSticker({ musicName }: { musicName: string }) {
  return (
    <div className="absolute bottom-20 left-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 animate-bounce shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 max-w-[250px] mx-auto">
      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 animate-spin-slow">
        <span className="text-sm">🎵</span>
      </div>
      <div className="overflow-hidden flex-1">
        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Audio Track</p>
        <p className="text-[11px] font-bold text-white truncate animate-pulse">{musicName}</p>
      </div>
    </div>
  )
}

function StoryOverlay({
  text,
  color,
  bg,
  size,
  position,
}: {
  text: string
  color: string
  bg: string
  size: string
  position: string
}) {
  if (!text) return null

  const sizeClasses = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm'

  let posClasses = ''
  if (position === 'top') {
    posClasses = 'top-14 left-4 right-4 text-center'
  } else if (position === 'bottom') {
    posClasses = 'bottom-14 left-4 right-4 text-center'
  } else if (position === 'top-left' || position === 'top_left' || position === 'top left') {
    posClasses = 'top-14 left-4 text-left max-w-[70%]'
  } else if (position === 'top-right' || position === 'top_right' || position === 'top right') {
    posClasses = 'top-14 right-4 text-right max-w-[70%] ml-auto'
  } else if (position === 'bottom-left' || position === 'bottom_left' || position === 'bottom left') {
    posClasses = 'bottom-14 left-4 text-left max-w-[70%]'
  } else if (position === 'bottom-right' || position === 'bottom_right' || position === 'bottom right') {
    posClasses = 'bottom-14 right-4 text-right max-w-[70%] ml-auto'
  } else {
    posClasses = 'top-1/2 -translate-y-1/2 left-4 right-4 text-center'
  }

  return (
    <div
      className={cn('absolute z-10 p-2.5 rounded-xl shadow-lg pointer-events-none select-none', posClasses)}
      style={{ color: color, backgroundColor: bg }}
    >
      <p className={cn('font-black uppercase tracking-wide drop-shadow-md', sizeClasses)}>{text}</p>
    </div>
  )
}

function getStoryBackgroundStyle(bgColor?: string) {
  if (!bgColor) return 'linear-gradient(to top right, rgba(88, 28, 135, 0.6), rgba(30, 58, 138, 0.6))'
  if (bgColor === 'sunset') return 'linear-gradient(to top right, #f43f5e, #f97316)'
  if (bgColor === 'indigo') return 'linear-gradient(to top right, #1e1b4b, #4f46e5)'
  if (bgColor === 'violet') return 'linear-gradient(to top right, #7c3aed, #db2777)'
  if (bgColor === 'emerald') return 'linear-gradient(to top right, #064e3b, #059669)'
  return bgColor // Hex color
}

function StoryPreview({
  account,
  mediaList,
  storyText,
  storyTextColor,
  storyTextBg,
  storyTextSize,
  storyTextPosition,
  storyBgColor,
  selectedMusic,
  platformStyle,
}: any) {
  const items = mediaList?.length ? mediaList : []
  const hasMedia = items.length > 0
  const firstItem = items[0]
  const isVideo = firstItem?.mime_type?.startsWith('video/') || firstItem?.file_path?.includes('.mp4')

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-black border border-white/10 text-white w-full aspect-[4/5] relative flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500',
        platformStyle?.border,
        platformStyle?.bg,
        platformStyle?.glow,
      )}
    >
      {/* Top Progress Indicators */}
      <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
        <div className="h-0.5 flex-1 bg-white rounded-full"></div>
        <div className="h-0.5 flex-1 bg-white/30 rounded-full"></div>
      </div>

      {/* Profile Header */}
      <div className="absolute top-4 left-3 right-3 flex items-center gap-2 z-20">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
          <Avatar className="w-full h-full">
            <AvatarImage src={account?.profile_picture} />
            <AvatarFallback className=" text-white flex items-center justify-center">
              <PlatformAvatarFallback platform={account?.platform} />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-[11px] font-bold drop-shadow-md">{account?.account_name || 'Your Account'}</p>
          <p className="text-[8px] text-white/60 drop-shadow-md">Sponsored</p>
        </div>
      </div>

      {/* Media Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0">
        {hasMedia ? (
          isVideo ? (
            <video
              src={process.env.NEXT_PUBLIC_STORAGE_URL + getImageUrl(firstItem.file_path)}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <Image
              src={process.env.NEXT_PUBLIC_STORAGE_URL + getImageUrl(firstItem.file_path)}
              alt="preview"
              fill
              unoptimized
              className="object-cover"
            />
          )
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center sm:p-6 p-4 text-center transition-all duration-500"
            style={{ background: getStoryBackgroundStyle(storyBgColor) }}
          >
            <span className="text-3xl mb-2 animate-pulse">✨</span>
            <p className="text-[10px] text-white/40">Story media will fill the screen</p>
          </div>
        )}
      </div>

      {/* Story Overlay Custom text */}
      <StoryOverlay
        text={storyText}
        color={storyTextColor}
        bg={storyTextBg}
        size={storyTextSize}
        position={storyTextPosition}
      />

      {/* Music Sticker Overlay */}
      {selectedMusic && <MusicSticker musicName={selectedMusic.name} />}
    </div>
  )
}

function MediaRenderer({ mediaList, media, aspect }: { mediaList?: any[]; media?: any; aspect?: string }) {
  const items = mediaList?.length ? mediaList : media ? [media] : []
  console.log("🚀 ~ MediaRenderer ~ items:", items)

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'relative w-full flex flex-col items-center justify-center text-center sm:p-6 p-4 bg-black/3 dark:bg-white/3 border border-glass-border',
          aspect,
        )}
      >
        <div className="w-16 h-16 rounded-3xl bg-white/5 border glass-border dark:bg-white/3! flex items-center justify-center mb-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md z-10 animate-pulse">
          <Heart className="w-8 h-8 text-primary opacity-60" />
        </div>
        <p className="text-sm font-black text-title-color dark:text-white z-10">No Media Selected</p>
        <p className="text-xs text-subtitle-color mt-1 z-10 leading-relaxed">
          Choose a beautiful image or video from your media library to preview it here live.
        </p>
      </div>
    )
  }

  if (items.length === 1) {
    const item = items[0]
    console.log("🚀 ~ MediaRenderer ~ item videoooooooo:", item)
    const isVideo = item?.mime_type?.startsWith('video/') || item?.file_path?.includes('.mp4')

    return (
      <div className={cn('relative bg-black/60 overflow-hidden', aspect)}>
        {isVideo ? (
          <video
            src={item.file_path}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <Image
            src={process.env.NEXT_PUBLIC_STORAGE_URL + getImageUrl(item.file_path)}
            alt="preview"
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative bg-black/60 overflow-hidden', aspect)}>
      <style>{`
        .network-preview-swiper .swiper-button-next,
        .network-preview-swiper .swiper-button-prev {
          color: white !important;
          transform: scale(0.5);
          background: transparent;
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        .network-preview-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }
        .network-preview-swiper .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full network-preview-swiper"
      >
        {items.map((item, idx) => {
          const isVideo = item?.mime_type?.startsWith('video/') || item?.file_path?.includes('.mp4')
          console.log(
            '🚀 ~ MediaRenderer ~ item.file_path:',
            process.env.NEXT_PUBLIC_STORAGE_URL + getImageUrl(item.file_path),
          )

          return (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {isVideo ? (
                <video
                  src={item.file_path}
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={process.env.NEXT_PUBLIC_STORAGE_URL + getImageUrl(item.file_path)}
                  alt="preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

function InstagramPreview({ account, caption, media, mediaList, selectedMusic, platformStyle }: NetworkPreviewProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 text-title-color dark:text-white w-full relative transition-all duration-500',
        platformStyle?.border,
        platformStyle?.bg,
        platformStyle?.glow,
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <Avatar className="w-full h-full">
            <AvatarImage src={account?.profile_picture} />
            <AvatarFallback className="text-title-color dark:text-white flex items-center justify-center bg-white dark:bg-black">
              <PlatformAvatarFallback platform={account?.platform} />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <p className="text-[12px] text-title-color dark:text-white font-bold">{account?.account_name}</p>
          <p className="text-[10px] text-subtitle-color uppercase tracking-wider">FEED</p>
        </div>
        <MoreHorizontal className="w-4 h-4 text-subtitle-color" />
      </div>
      <div className="relative">
        <MediaRenderer mediaList={mediaList} media={media} aspect="aspect-square" />
        {selectedMusic && <MusicSticker musicName={selectedMusic.name} />}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4 text-title-color dark:text-white">
          <Heart className="w-5 h-5" />
          <MessageCircle className="w-5 h-5" />
          <Send className="w-5 h-5" />
        </div>
        <div className="text-[11px] leading-relaxed text-subtitle-color max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          <span className="font-bold mr-1 text-title-color dark:text-white">{account?.account_name}</span>
          {renderCaptionWithHashtags(caption, 'instagram')}
        </div>
      </div>
    </div>
  )
}

function LinkedInPreview({ account, caption, media, mediaList, selectedMusic, platformStyle }: NetworkPreviewProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-white dark:bg-[#1b1f23] border border-gray-200 dark:border-white/10 text-title-color dark:text-white w-full relative transition-all duration-500',
        platformStyle?.border,
        platformStyle?.bg,
        platformStyle?.glow,
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <Avatar className="w-10 h-10 border border-blue-500/40">
          <AvatarImage src={account?.profile_picture} />
          <AvatarFallback className="bg-blue-50 dark:bg-blue-600/20 text-blue-500 dark:text-blue-300 flex items-center justify-center">
            <PlatformAvatarFallback platform={account?.platform} />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-[12px] font-bold">{account?.account_name}</p>
          <div className="flex items-center gap-1 text-[9px] text-subtitle-color">
            <span>Now</span>
            <span>·</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-subtitle-color" />
      </div>
      <div className="px-4 pb-3 text-[11px] leading-relaxed text-subtitle-color max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {renderCaptionWithHashtags(caption, 'linkedin')}
      </div>
      <div className="relative">
        <MediaRenderer mediaList={mediaList} media={media} aspect="aspect-[1.91/1]" />
        {selectedMusic && <MusicSticker musicName={selectedMusic.name} />}
      </div>
      <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-200 dark:border-white/5 text-subtitle-color text-[11px]">
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  )
}

function TwitterPreview({ account, caption, media, mediaList, selectedMusic, platformStyle }: NetworkPreviewProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 text-title-color dark:text-white w-full relative transition-all duration-500',
        platformStyle?.border,
        platformStyle?.bg,
        platformStyle?.glow,
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 shrink-0 border border-gray-200 dark:border-white/10">
            <AvatarImage src={account?.profile_picture} />
            <AvatarFallback className="bg-gray-100 dark:bg-white/10 text-title-color dark:text-white flex items-center justify-center">
              <PlatformAvatarFallback platform={account?.platform} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold">{account?.account_name}</span>
              <span className="text-[10px] text-subtitle-color">
                @{account?.account_name?.toLowerCase().replace(/\s/g, '_')}
              </span>
              <MoreHorizontal className="w-3.5 h-3.5 text-subtitle-color ml-auto" />
            </div>
            <div className="text-[11px] leading-relaxed text-subtitle-color max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {renderCaptionWithHashtags(caption, 'twitter')}
            </div>
            <div className="rounded-xl overflow-hidden relative">
              <MediaRenderer mediaList={mediaList} media={media} aspect="aspect-video" />
              {selectedMusic && <MusicSticker musicName={selectedMusic.name} />}
            </div>
            <div className="flex items-center gap-5 text-subtitle-color pt-1">
              <MessageCircle className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
              <Repeat2 className="w-4 h-4 hover:text-green-500 cursor-pointer transition-colors" />
              <Heart className="w-4 h-4 hover:text-pink-500 cursor-pointer transition-colors" />
              <Share className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FacebookPreview({ account, caption, media, mediaList, selectedMusic, platformStyle }: NetworkPreviewProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-white/10 text-title-color dark:text-white w-full relative transition-all duration-500',
        platformStyle?.border,
        platformStyle?.bg,
        platformStyle?.glow,
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <Avatar className="w-10 h-10 border-2 border-blue-500/30">
          <AvatarImage src={account?.profile_picture} />
          <AvatarFallback className="bg-blue-50 dark:bg-blue-600/20 text-blue-500 flex items-center justify-center">
            <PlatformAvatarFallback platform={account?.platform} />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-md font-bold">{account?.account_name}</p>
          <div className="flex items-center gap-1 text-[12px] text-subtitle-color">
            <span>Just now</span>
            <span>·</span>
            <Globe className="w-2.5 h-2.5" />
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-subtitle-color ml-auto" />
      </div>
      <div className="px-4 pb-3 text-[12px] leading-relaxed text-subtitle-color max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {renderCaptionWithHashtags(caption, 'facebook')}
      </div>
      <div className="relative">
        <MediaRenderer mediaList={mediaList} media={media} aspect="aspect-[1.91/1]" />
        {selectedMusic && <MusicSticker musicName={selectedMusic.name} />}
      </div>
      <div className="flex items-center px-4 py-2.5 border-t border-gray-200 dark:border-white/5 gap-1 text-subtitle-color text-[11px]">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <ThumbsUp className="w-3.5 h-3.5" />
          Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <Share className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  )
}

export function NetworkPreview({
  account,
  caption,
  media,
  mediaList,
  storyText,
  storyTextColor,
  storyTextBg,
  storyTextSize,
  storyTextPosition,
  storyBgColor,
  selectedMusic,
  activeTab,
  platformStyle,
}: NetworkPreviewProps) {
  const platform = account?.platform?.toLowerCase()

  if (activeTab === 'story') {
    return (
      <StoryPreview
        account={account}
        mediaList={mediaList}
        storyText={storyText}
        storyTextColor={storyTextColor}
        storyTextBg={storyTextBg}
        storyTextSize={storyTextSize}
        storyTextPosition={storyTextPosition}
        storyBgColor={storyBgColor}
        selectedMusic={selectedMusic}
        platformStyle={platformStyle}
      />
    )
  }

  if (platform === 'instagram')
    return (
      <InstagramPreview
        account={account}
        caption={caption}
        media={media}
        mediaList={mediaList}
        selectedMusic={selectedMusic}
        platformStyle={platformStyle}
      />
    )
  if (platform === 'linkedin')
    return (
      <LinkedInPreview
        account={account}
        caption={caption}
        media={media}
        mediaList={mediaList}
        selectedMusic={selectedMusic}
        platformStyle={platformStyle}
      />
    )
  if (platform === 'twitter')
    return (
      <TwitterPreview
        account={account}
        caption={caption}
        media={media}
        mediaList={mediaList}
        selectedMusic={selectedMusic}
        platformStyle={platformStyle}
      />
    )
  if (platform === 'facebook')
    return (
      <FacebookPreview
        account={account}
        caption={caption}
        media={media}
        mediaList={mediaList}
        selectedMusic={selectedMusic}
        platformStyle={platformStyle}
      />
    )
  return (
    <InstagramPreview
      account={account}
      caption={caption}
      media={media}
      mediaList={mediaList}
      selectedMusic={selectedMusic}
      platformStyle={platformStyle}
    />
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Feature } from '@/types/landing'
import { getResolvedImageUrl } from '@/utils/image'
import { motion } from 'framer-motion'
import {
  Bookmark,
  Facebook,
  Heart,
  Image as ImageIcon,
  Instagram,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Music2,
  Play,
  Send,
  Share2,
  Sparkles,
  ThumbsUp,
} from 'lucide-react'
import Image from 'next/image'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export function PlatformMockup({
  activeTab,
  currentContent,
}: any) {
  return (
    <div className="flex-1 relative w-full flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[340px]"
      >
        {/* Phone Frame */}
        <div className="relative p-3 rounded-[3rem] bg-[#1A1D27] border-[6px] border-[#2A2E3D] shadow-2xl aspect-[9/16] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2A2E3D] rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-black/40" />
            <div className="w-10 h-1 bg-black/40 rounded-full" />
          </div>

          <div className="h-full w-full rounded-[2.2rem] bg-black overflow-hidden relative">
            <Swiper
              direction="vertical"
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay, Pagination]}
              className="h-full w-full"
              pagination={{ clickable: true, dynamicBullets: true }}
            >
              {activeTab === 'instagram' ? (
                <>
                  <SwiperSlide>
                    <InstagramStory feature={currentContent?.features?.[0]} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <InstagramReel feature={currentContent?.features?.[1]} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <InstagramPost feature={currentContent?.features?.[2]} />
                  </SwiperSlide>
                </>
              ) : (
                <>
                  <SwiperSlide>
                    <FacebookStory feature={currentContent?.features?.[0]} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <FacebookReel feature={currentContent?.features?.[1]} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <FacebookPost feature={currentContent?.features?.[2]} />
                  </SwiperSlide>
                </>
              )}
            </Swiper>
          </div>
        </div>

        {/* Floating Icons */}
        <FloatingIcons activeTab={activeTab} />
      </motion.div>

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
    </div>
  )
}

function InstagramStory({ feature }: any) {
  const bgImg = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/story.png')
  return (
    <div
      className="h-full w-full bg-gradient-to-b from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-cover bg-center relative p-6 flex flex-col"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex gap-1 mb-4 mt-6">
        <div className="h-1 flex-1 bg-white/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="h-full bg-white"
          />
        </div>
        <div className="h-1 flex-1 bg-white/20 rounded-full" />
      </div>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full border-2 border-white p-0.5">
          <div className="w-full h-full rounded-full bg-white/20" />
        </div>
        <div className="h-2 w-20 bg-white/40 rounded-full" />
      </div>
      <div className="mt-auto flex items-center gap-4">
        <div className="flex-1 h-10 rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-4 flex items-center">
          <span className="text-[10px] text-white/60 font-medium">Send message</span>
        </div>
        <Heart className="w-6 h-6 text-white" />
        <Send className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}

function InstagramReel({ feature }: any) {
  const bgImg = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/reels.png')
  return (
    <div className="h-full w-full bg-black relative">
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-6 flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="flex justify-between items-center mt-6">
          <span className="text-white font-bold text-lg">Reels</span>
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600" />
              <span className="text-white text-xs font-bold">username</span>
              <Button className="px-2 py-0.5 border border-white rounded-md text-[10px] text-white font-bold">
                Follow
              </Button>
            </div>
            <div className="h-2 w-48 bg-white/20 rounded-full mb-2" />
            <div className="flex items-center gap-2">
              <Music2 className="w-3 h-3 text-white" />
              <div className="h-1.5 w-24 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 pb-4">
            <div className="flex flex-col items-center gap-1">
              <Heart className="w-7 h-7 text-white" />
              <span className="text-[10px] text-white font-medium">124K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-[10px] text-white font-medium">1.2K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Send className="w-7 h-7 text-white" />
            </div>
            <MoreHorizontal className="w-7 h-7 text-white" />
            <div className="w-7 h-7 rounded-md border-2 border-white overflow-hidden">
              <div className="w-full h-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-10 h-10 text-white" fill="white" />
        </div>
      </div>
    </div>
  )
}

function InstagramPost({ feature }: any) {
  const imgUrl = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/post.png')
  return (
    <div className="h-full w-full flex flex-col bg-black">
      <div className="px-4 py-4 border-b border-white/5 flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-black border border-black overflow-hidden">
              <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
          <div className="h-2 w-20 bg-white/20 rounded-full" />
        </div>
        <MoreHorizontal className="w-4 h-4 text-white/40" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="aspect-square bg-gradient-to-br from-[#2D3436] to-[#000000] relative flex items-center justify-center overflow-hidden">
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-secondary/40 animate-pulse" />
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-3xl bg-secondary/20 flex items-center justify-center mx-auto mb-4 border border-secondary/30">
              <ImageIcon className="w-8 h-8 text-secondary" />
            </div>
            <div className="h-2 w-32 bg-white/10 rounded-full mx-auto mb-2" />
            <div className="h-2 w-24 bg-white/10 rounded-full mx-auto" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <Image
              src={imgUrl}
              alt={'POST'}
              fill
              unoptimized
              className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-white" />
              <MessageCircle className="w-6 h-6 text-white" />
              <Send className="w-6 h-6 text-white" />
            </div>
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div className="h-2 w-24 bg-white/20 rounded-full mb-3" />
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-3/4 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/80 backdrop-blur-md mt-auto">
        <ImageIcon className="w-6 h-6 text-white" />
        <ImageIcon className="w-6 h-6 text-white/40" />
        <div className="w-6 h-6 rounded-md border-2 border-white/40" />
        <ImageIcon className="w-6 h-6 text-white/40" />
        <div className="w-6 h-6 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

function FacebookStory({ feature }: any) {
  const bgImg = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/f-story.png')
  return (
    <div
      className="h-full w-full bg-cover bg-center relative p-6 flex flex-col"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex gap-1 mb-4 mt-6">
        <div className="h-1 flex-1 bg-white/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="h-full bg-white"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/20">
          <Facebook className="w-full h-full text-white" fill="white" />
        </div>
        <div>
          <div className="h-2 w-24 bg-white/40 rounded-full mb-1" />
          <div className="h-1.5 w-12 bg-white/20 rounded-full" />
        </div>
      </div>
      <div className="mt-auto flex items-center gap-4">
        <div className="flex-1 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-4 flex items-center">
          <span className="text-[10px] text-white/80 font-medium italic">Write a comment...</span>
        </div>
        <div className="flex gap-3">
          <ThumbsUp className="w-6 h-6 text-white" fill="white" />
          <Heart className="w-6 h-6 text-white" fill="white" />
          <Share2 className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

function FacebookReel({ feature }: any) {
  const bgImg = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/f-reels.png')
  return (
    <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent p-6 flex flex-col">
        <div className="flex items-center gap-2 mt-6">
          <Facebook className="w-8 h-8 text-facebook" fill="#1877F2" />
          <span className="text-white font-bold">Reels</span>
        </div>
        <div className="mt-auto flex justify-between items-end pb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-facebook flex items-center justify-center shadow-lg">
                <Facebook className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-white font-bold shadow-sm">Page Name</span>
            </div>
            <div className="h-3 w-56 bg-white/20 rounded-full mb-3" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-facebook/40 rounded-full flex items-center px-2 gap-1">
                <Music2 className="w-2.5 h-2.5 text-facebook" />
                <div className="h-1 w-10 bg-facebook/40 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-7">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-[10px] text-white font-bold">45K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] text-white font-bold">2K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <MoreHorizontal className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <Play className="w-16 h-16 text-facebook/60 animate-pulse" fill="#1877F2" />
      </div>
    </div>
  )
}

function FacebookPost({ feature }: any) {
  const bgImg = getResolvedImageUrl(feature?.image_id?.file_path || feature?.image_id, '/images/landing/f-post.png')
  return (
    <div className="h-full w-full flex flex-col bg-[#18191A]">
      <div className="px-4 py-4 border-b border-white/5 flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-facebook flex items-center justify-center">
            <Facebook className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <div className="h-2.5 w-24 bg-white/20 rounded-full mb-1.5" />
            <div className="h-2 w-16 bg-white/10 rounded-full" />
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-white/40" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4">
          <div className="h-2 w-full bg-white/10 rounded-full mb-2" />
          <div className="h-2 w-5/6 bg-white/10 rounded-full mb-4" />
        </div>
        <div
          className="h-64 bg-cover bg-center relative flex items-center justify-center border-y border-white/5"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="h-3 w-40 bg-white/10 rounded-full mx-auto" />
        </div>
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center -space-x-1">
            <div className="w-5 h-5 rounded-full bg-facebook flex items-center justify-center ring-2 ring-[#18191A]">
              <ThumbsUp className="w-3 h-3 text-white" fill="white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-[#18191A]">
              <Heart className="w-3 h-3 text-white" fill="white" />
            </div>
          </div>
          <div className="h-2 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="px-2 py-1 flex justify-around">
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-white/40">
            <ThumbsUp className="w-5 h-5" />
            <span className="text-xs font-semibold">Like</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-white/40">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-semibold">Comment</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-white/40">
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-semibold">Share</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function FloatingIcons({ activeTab }: any) {
  return (
    <>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-12 -right-8 w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl z-20"
      >
        {activeTab === 'instagram' ? (
          <Instagram className="w-10 h-10 text-[#E1306C]" />
        ) : (
          <Facebook className="w-10 h-10 text-facebook" />
        )}
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-8 -left-12 w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl z-20"
      >
        <Sparkles className="w-12 h-12 text-secondary" />
      </motion.div>
    </>
  )
}

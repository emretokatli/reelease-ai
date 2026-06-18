import { useSectionRefs } from '@/context/SectionRefsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Facebook, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { platformContent } from '@/data/landing'
import { PlatformTabs } from './showcase/PlatformTabs'
import { PlatformContent } from './showcase/PlatformContent'
import { PlatformMockup } from './showcase/PlatformMockup'
import { DynamicPlatform, LandingPageData } from '@/types/landing'



export default function SocialMediaShowcase({ data }: { data?: LandingPageData['social'] }) {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()

  // Use data from props if available, otherwise use hardcoded platforms
  const dynamicPlatforms = data?.platforms || []
  const initialTab = (dynamicPlatforms.length > 0
    ? dynamicPlatforms[0]?.name
    : 'instagram').toLowerCase()

  const [activeTab, setActiveTab] = useState(initialTab)

  // Update active tab when dynamic platforms load
  useEffect(() => {
    if (dynamicPlatforms.length > 0) {
      setActiveTab(dynamicPlatforms[0]?.name?.toLowerCase())
    }
  }, [dynamicPlatforms])

  // Merge dynamic content with static content (gradients, colors, icons)
  const getPlatformConfig = (id: string) => {
    const staticConfig = platformContent[id as keyof typeof platformContent] || platformContent.instagram
    const dynamicConfig = dynamicPlatforms.find((p: DynamicPlatform) => p.name?.toLowerCase() === id)

    if (dynamicConfig) {
      return {
        ...staticConfig,
        badge: dynamicConfig.badge || staticConfig.badge,
        title: dynamicConfig.title || staticConfig.title,
        highlight: dynamicConfig.highlight || staticConfig.highlight,
        description: dynamicConfig.description || staticConfig.description,
        features: dynamicConfig.features?.length > 0
          ? dynamicConfig.features.map((f: { title: string, description: string, image_id?: any }, i: number) => ({
            title: f.title,
            description: f.description,
            image_id: f.image_id,
            icon: staticConfig.features[i]?.icon || Sparkles
          }))
          : staticConfig.features
      }
    }
    return staticConfig
  }

  const currentContent = getPlatformConfig(activeTab)
  const displayPlatforms = dynamicPlatforms.length > 0
    ? dynamicPlatforms.map((p: DynamicPlatform) => ({
      id: p.name?.toLowerCase(),
      name: p.name,
      icon: p.name?.toLowerCase() === 'facebook' ? Facebook : Instagram,
      color: p.name?.toLowerCase() === 'facebook' ? '#1877F2' : '#E1306C'
    }))
    : [
      { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' },
      { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    ]

  return (
    <section
      id="social"
      ref={(el) => registerRef('social', el)}
      className="relative py-24 md:py-30 pb-0! bg-light-body"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-left"
          >
            <PlatformTabs
              displayPlatforms={displayPlatforms}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <AnimatePresence mode="wait">
              <PlatformContent
                currentContent={currentContent}
                activeTab={activeTab}
                t={t}
              />
            </AnimatePresence>
          </motion.div>

          <PlatformMockup activeTab={activeTab} currentContent={currentContent} />
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        :global(.swiper-pagination-bullet) {
          background: rgba(255, 255, 255, 0.4) !important;
        }
        :global(.swiper-pagination-bullet-active) {
          background: white !important;
        }
      `}</style>
    </section>
  )
}

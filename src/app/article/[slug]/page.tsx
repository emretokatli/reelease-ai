'use client'

import LandingFooter from '@/components/landing/LandingFooter'
import LandingHeader from '@/components/landing/LandingHeader'
import { SectionRefsProvider } from '@/context/SectionRefsContext'
import { useGetBlogBySlugQuery } from '@/redux/api/blogApi'
import { useGetLandingPageQuery } from '@/redux/api/landingPageApi'
import { formatDate, getMediaUrl } from '@/utils'
import DOMPurify from 'dompurify'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function BlogDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const slug = params.slug as string

  const { data, isLoading } = useGetBlogBySlugQuery(slug, { skip: !slug })
  const { data: landingData } = useGetLandingPageQuery()

  // Backend may return the blog directly or wrapped in { blog }
  const blog: any = (data as any)?.blog ?? data
  const footerData = landingData?.landing_page?.footer

  const coverUrl = blog?.thumbnail_id?.file_path
    ? getMediaUrl(blog.thumbnail_id.file_path)
    : null

  const sanitizedContent = DOMPurify.sanitize(blog?.content || '', {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's',
      'blockquote', 'ul', 'ol', 'li', 'br', 'hr', 'a', 'img', 'figure',
      'figcaption', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'width', 'height'],
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-white/60 mb-8">{t('no_blogs_found')}</p>
        <Link href="/" className="px-6 py-3 bg-primary text-black font-bold rounded-xl">
          {t('back_to_home')}
        </Link>
      </div>
    )
  }

  return (
    <SectionRefsProvider>
      <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white">
        <LandingHeader />

        <main className="relative pt-32 pb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <article className="container mx-auto px-6 max-w-4xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link href="/#blog" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4" /> {t('our_blog')}
              </Link>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                {blog.title}
              </h1>
              <p className="text-white/40 text-sm mb-8">{formatDate(blog.created_at)}</p>

              {coverUrl && (
                <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden mb-10 border border-white/10">
                  <Image src={coverUrl} alt={blog.title} fill className="object-cover" unoptimized />
                </div>
              )}

              <div
                className="prose prose-invert prose-primary max-w-none
                  prose-headings:text-white prose-p:text-white/70 prose-p:leading-relaxed
                  prose-li:text-white/70 prose-strong:text-white prose-a:text-primary
                  hover:prose-a:text-primary/80 prose-img:rounded-2xl transition-colors"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </motion.div>
          </article>
        </main>

        <LandingFooter data={footerData} />
      </div>
    </SectionRefsProvider>
  )
}

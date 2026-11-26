import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Loader2 } from 'lucide-react'
import { useBlog } from '../api/storefront'
import PageHeader from '../components/PageHeader'
import ParticleBackground from '../components/ParticleBackground'
import CustomCursor from '../components/CustomCursor'
import { useLanguage } from '../context/LanguageContext'
import { useSeo } from '../hooks/useSeo'

const PLACEHOLDER_IMAGE = '/assets/bgd.png'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useLanguage()
  const { data: post, isLoading, isError } = useBlog(slug)

  useSeo(lang === 'ar' && post?.seo_ar ? post.seo_ar : post?.seo)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const title = post
    ? lang === 'ar' ? (post.title_ar ?? post.title) : post.title
    : ''
  const content = post
    ? lang === 'ar' ? (post.content_ar ?? post.content) : post.content
    : ''
  const category = post?.sub_category?.name ?? post?.category?.name
  const date = post
    ? new Date(post.blog_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="bg-black min-h-screen">
      <CustomCursor />
      <ParticleBackground />
      <PageHeader />

      <main className="relative z-20 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-[#d4af37]" size={28} />
            </div>
          ) : isError || !post ? (
            <div className="text-center py-32">
              <p className="text-white/40 text-sm mb-6">
                {t('Article not found.', 'المقال غير موجود.')}
              </p>
              <Link
                to="/blog"
                className="text-[#d4af37] text-sm hover:underline"
              >
                {t('Back to articles', 'العودة للمقالات')}
              </Link>
            </div>
          ) : (
            <article>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/40 hover:text-[#d4af37] text-xs tracking-wider uppercase transition-colors mb-8"
              >
                <ArrowLeft size={14} className="rtl:-scale-x-100" />
                {t('All articles', 'كل المقالات')}
              </Link>

              {category && (
                <span className="block w-fit mb-4 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full text-[10px] text-[#d4af37] tracking-widest uppercase font-mono">
                  {category}
                </span>
              )}

              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {title}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-xs text-white/30 tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#d4af37]/50" />
                  {date}
                </span>
                <span>·</span>
                <span>Legend ProteK</span>
              </div>

              <div
                className="mt-6 h-[1px] w-24"
                style={{
                  background:
                    'linear-gradient(90deg, rgb(212, 175, 55), transparent)',
                }}
              />

              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={post.image ?? post.image_url ?? PLACEHOLDER_IMAGE}
                  alt={title}
                  className="w-full max-h-[480px] object-cover"
                />
              </div>

              <div
                className="blog-content mt-10"
                dangerouslySetInnerHTML={{ __html: content ?? '' }}
              />
            </article>
          )}
        </div>
      </main>
    </div>
  )
}

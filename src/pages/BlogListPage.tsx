import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Loader2 } from 'lucide-react'
import { useBlogs } from '../api/storefront'
import PageHeader from '../components/PageHeader'
import ParticleBackground from '../components/ParticleBackground'
import CustomCursor from '../components/CustomCursor'
import { useLanguage } from '../context/LanguageContext'

const PLACEHOLDER_IMAGE = '/assets/bgd.png'

export default function BlogListPage() {
  const { t, lang } = useLanguage()
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useBlogs()

  const posts = data ? data.pages.flatMap((p) => p.posts) : []

  useEffect(() => {
    document.title = t('Blog | Legend ProteK', 'المدونة | ليجند بروتك')
    window.scrollTo(0, 0)
  }, [t])

  return (
    <div className="bg-black min-h-screen">
      <CustomCursor />
      <ParticleBackground />
      <PageHeader />

      <main className="relative z-20 pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
              {t('Blog', 'المدونة')}
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              {t('The', 'مقالات')}{' '}
              <span className="gold-gradient-text">{t('Blog', 'السيارات')}</span>
            </h1>
            <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
              {t(
                'Stories, guides, and expertise from the Legend ProteK workshop — for owners who care about every detail.',
                'قصص وأدلة وخبرات من ورشة ليجند بروتك — لمالكي السيارات الذين يهتمون بكل التفاصيل.',
              )}
            </p>
            <div
              className="mx-auto mt-6 w-16 h-[1px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgb(212, 175, 55), transparent)',
              }}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-[#d4af37]" size={28} />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-white/40 text-sm py-16">
              {t('No articles published yet.', 'لا توجد مقالات منشورة بعد.')}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {posts.map((post, i) => {
                  const title = lang === 'ar' ? (post.title_ar ?? post.title) : post.title
                  const excerpt = lang === 'ar' ? (post.excerpt_ar ?? post.excerpt) : post.excerpt
                  const category = post.sub_category?.name ?? post.category?.name
                  const date = new Date(post.blog_date).toLocaleDateString(
                    lang === 'ar' ? 'ar-EG' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' },
                  )
                  const featured = i === 0

                  return (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className={`glass-panel rounded-xl overflow-hidden group hover:border-[#d4af37]/30 transition-all duration-500 flex ${
                        featured ? 'md:col-span-2 flex-col md:flex-row' : 'flex-col'
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          featured ? 'md:w-1/2 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'
                        }`}
                      >
                        <img
                          src={post.image ?? post.image_url ?? PLACEHOLDER_IMAGE}
                          alt={title}
                          draggable={false}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {category && (
                          <span className="absolute top-4 start-4 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full text-[10px] text-[#d4af37] tracking-widest uppercase font-mono">
                            {category}
                          </span>
                        )}
                      </div>
                      <div className={`${featured ? 'p-6 md:p-8' : 'p-6'} flex flex-col flex-1`}>
                        <div className="flex items-center gap-4 text-[10px] text-white/30 tracking-widest uppercase">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3 text-[#d4af37]/50" />
                            {date}
                          </span>
                        </div>
                        <h3
                          className={`mt-3 font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300 leading-snug ${
                            featured ? 'text-xl md:text-2xl' : 'text-lg'
                          }`}
                        >
                          {title}
                        </h3>
                        {excerpt && (
                          <p className="mt-3 text-sm text-white/40 leading-relaxed line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                        <span className="mt-auto pt-5 flex items-center gap-2 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors duration-300">
                          <span className="text-xs tracking-wider uppercase">
                            {t('Read Article', 'اقرأ المقال')}
                          </span>
                          <ArrowRight className="w-4 h-4 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="flex items-center gap-2 border border-[#d4af37]/40 text-[#d4af37] rounded-lg px-8 py-3 text-sm hover:bg-[#d4af37]/10 transition-colors disabled:opacity-50"
                  >
                    {isFetchingNextPage && <Loader2 size={14} className="animate-spin" />}
                    {t('Load More', 'عرض المزيد')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

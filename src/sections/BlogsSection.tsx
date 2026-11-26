import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Loader2 } from 'lucide-react'
import { useBlogs } from '../api/storefront'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER_IMAGE = '/assets/bgd.png'

interface CardPost {
  key: string | number
  slug: string | null
  image: string
  category: string | null
  date: string
  title: string
  excerpt: string | null
}

/* Static fallback — shown only when the storefront API isn't configured. */
const STATIC_POSTS: Omit<CardPost, 'slug' | 'image'>[] = [
  {
    key: 'ppf-guide',
    category: 'Protection',
    date: 'Jan 12, 2026',
    title: 'The Complete Guide to Paint Protection Film',
    excerpt:
      'Everything you need to know about PPF — how self-healing technology works, why thickness matters, and what separates premium films from cheap imitations.',
  },
  {
    key: 'ceramic-vs-wax',
    category: 'Coating',
    date: 'Jan 5, 2026',
    title: 'Ceramic Coating vs. Traditional Wax',
    excerpt:
      "Wax lasts weeks. Ceramic lasts years. We break down the chemistry behind nano-ceramic bonds and why it's worth the investment.",
  },
  {
    key: 'cairo-climate',
    category: 'Care',
    date: 'Dec 28, 2025',
    title: "Protecting Your Paint in Cairo's Harsh Climate",
    excerpt:
      "Dust storms, UV exposure, and extreme heat are silently destroying your finish. Here's how to fight back with the right protection strategy.",
  },
  {
    key: 'inside-vault',
    category: 'Vault',
    date: 'Dec 20, 2025',
    title: 'Inside the Vault: How We Store Legends',
    excerpt:
      'Climate control, battery tenders, and 24/7 monitoring — a look at what happens to your vehicle when it enters our secure storage facility.',
  },
  {
    key: 'paint-correction',
    category: 'Detailing',
    date: 'Dec 14, 2025',
    title: '5 Signs Your Paint Needs Correction',
    excerpt:
      'Swirl marks, holograms, and dull spots are more than cosmetic issues. Learn to spot damage before it becomes permanent.',
  },
]

const STATIC_IMAGES = [
  '/assets/cars/4_Photograph_porsche_medium_close_up.png',
  '/assets/cars/3_Sleek_Black_Ferrari_812_superfast.png',
  '/assets/cars/5_luxury_sport_car_in_dark_studio_with.png',
  '/assets/cars/9_rollsroyce_dark.png',
  '/assets/cars/1_Kinetics_Drive_in_Car_Photo_Studi.png',
]

export default function BlogsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t, lang } = useLanguage()

  const { data, isLoading } = useBlogs()
  const apiPosts = data ? data.pages.flatMap((p) => p.posts) : undefined

  const posts: CardPost[] =
    apiPosts !== undefined
      ? apiPosts.map((b) => ({
          key: b.id,
          slug: b.slug ?? null,
          image: b.image ?? b.image_url ?? PLACEHOLDER_IMAGE,
          category: b.sub_category?.name ?? b.category?.name ?? null,
          date: new Date(b.blog_date).toLocaleDateString(
            lang === 'ar' ? 'ar-EG' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' },
          ),
          title: lang === 'ar' ? (b.title_ar ?? b.title) : b.title,
          excerpt: lang === 'ar' ? (b.excerpt_ar ?? b.excerpt) : b.excerpt,
        }))
      : STATIC_POSTS.map((s, i) => ({
          ...s,
          slug: null,
          image: STATIC_IMAGES[i % STATIC_IMAGES.length],
        }))

  const [featured, ...rest] = posts

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blogs-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        },
      )
      gsap.fromTo(
        '.blog-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.blogs-grid', start: 'top 80%', once: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative z-20 bg-black py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#d4af37]/[0.015] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="blogs-header text-center mb-16 md:mb-20">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Blog', 'المدونة')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {t('The', 'مقالات')}{' '}
            <span className="gold-gradient-text">{t('Blog', 'السيارات')}</span>
          </h2>
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
            <div className="blogs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              <PostCard post={featured} featured t={t} />
              {rest.map((post) => (
                <PostCard key={post.key} post={post} t={t} />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                to="/blog"
                className="flex items-center gap-2 border border-[#d4af37]/40 text-[#d4af37] rounded-lg px-8 py-3 text-sm hover:bg-[#d4af37]/10 transition-colors"
              >
                {t('View All Articles', 'عرض كل المقالات')}
                <ArrowRight size={14} className="rtl:-scale-x-100" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function PostCard({
  post,
  featured = false,
  t,
}: {
  post: CardPost
  featured?: boolean
  t: (en: string, ar: string) => string
}) {
  const className = `blog-card glass-panel rounded-xl overflow-hidden group hover:border-[#d4af37]/30 transition-all duration-500 flex ${
    featured ? 'md:col-span-2 flex-col md:flex-row' : 'flex-col'
  }`

  const body = (
    <>
      <div
        className={`relative overflow-hidden ${
          featured ? 'md:w-1/2 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={post.image}
          alt={post.title}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {post.category && (
          <span className="absolute top-4 start-4 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full text-[10px] text-[#d4af37] tracking-widest uppercase font-mono">
            {post.category}
          </span>
        )}
      </div>
      <div className={`${featured ? 'p-6 md:p-8' : 'p-6'} flex flex-col flex-1`}>
        <div className="flex items-center gap-4 text-[10px] text-white/30 tracking-widest uppercase">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3 text-[#d4af37]/50" />
            {post.date}
          </span>
        </div>
        <h3
          className={`mt-3 font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300 leading-snug ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 text-sm text-white/40 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto pt-5 flex items-center gap-2 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors duration-300">
          <span className="text-xs tracking-wider uppercase">
            {t('Read Article', 'اقرأ المقال')}
          </span>
          <ArrowRight className="w-4 h-4 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </>
  )

  return post.slug ? (
    <Link to={`/blog/${post.slug}`} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  )
}

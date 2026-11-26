import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { BUSINESS_ID, STOREFRONT_ENABLED } from '../config'
import { request } from './client'
import type { ApiResponse } from './types'

export interface SliderItem {
  id: number
  media_url: string
  media_type: 'image' | 'video'
  sort_order: number
}

export interface PortfolioItem {
  id: number
  name_ar: string
  name_en: string | null
  image_url: string | null
}

export interface CareerPosition {
  id: number
  title_ar: string
  title_en: string | null
  department_ar: string | null
  department_en: string | null
  employment_type: string | null
  sort_order: number
}

export interface CareersLocation {
  id: number
  name: string
  address: string
  landmark?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  latitude?: string | null
  longitude?: string | null
}

export interface CareersData {
  positions: CareerPosition[]
  location: CareersLocation | null
  hr_email: string | null
}

export interface BlogCategory {
  id: number
  name: string
}

export interface BlogSeo {
  title: string
  description: string
  keywords: string[]
  canonical: string
  robots: string
  og: {
    title: string
    description: string
    image: string | null
    url: string
    type: string
  }
  twitter: {
    card: string
    title: string
    description: string
    image: string | null
  }
  article: {
    published_time: string
    modified_time: string
    author?: { name: string; url: string }
  }
  structured_data?: Record<string, unknown>
}

export interface BlogListItem {
  id: number
  title: string
  title_ar: string | null
  slug: string
  image: string | null
  image_url?: string | null
  blog_date: string
  excerpt: string | null
  excerpt_ar: string | null
  category: BlogCategory | null
  sub_category: BlogCategory | null
  created_at?: string
  updated_at?: string
  seo?: BlogSeo
  seo_ar?: BlogSeo | null
}

export interface BlogPost extends BlogListItem {
  content: string
  content_ar: string | null
}

export interface BlogMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface SocialLink {
  id: number
  name: string
  icon_url: string | null
  link: string
}

const ecommerce = <T>(path: string) =>
  request<ApiResponse<T>>(`/connector/api/ecommerce/${path}?business_id=${BUSINESS_ID}`).then(
    (r) => r.data,
  )

export function useSliders() {
  return useQuery({
    queryKey: ['sliders', BUSINESS_ID],
    queryFn: () => ecommerce<SliderItem[]>('sliders'),
    enabled: STOREFRONT_ENABLED,
    staleTime: 60_000,
  })
}

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio', BUSINESS_ID],
    queryFn: () => ecommerce<PortfolioItem[]>('portfolio'),
    enabled: STOREFRONT_ENABLED,
    staleTime: 60_000,
  })
}

export function useCareers() {
  return useQuery({
    queryKey: ['careers', BUSINESS_ID],
    queryFn: () => ecommerce<CareersData>('careers'),
    enabled: STOREFRONT_ENABLED,
    staleTime: 60_000,
  })
}

export function useSocialMedia() {
  return useQuery({
    queryKey: ['social-media', BUSINESS_ID],
    queryFn: () => ecommerce<SocialLink[]>('social-media'),
    enabled: STOREFRONT_ENABLED,
    staleTime: 300_000,
    retry: 1,
  })
}

const getBlogs = (page: number) =>
  request<ApiResponse<BlogListItem[]> & { meta: BlogMeta }>(
    `/connector/api/ecommerce/blogs?business_id=${BUSINESS_ID}&per_page=12&page=${page}`,
  ).then((r) => ({ posts: r.data, meta: r.meta }))

export function useBlogs() {
  return useInfiniteQuery({
    queryKey: ['blogs', BUSINESS_ID],
    queryFn: ({ pageParam }) => getBlogs(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
    enabled: STOREFRONT_ENABLED,
    staleTime: 60_000,
  })
}

const getBlog = (slug: string) =>
  request<ApiResponse<BlogPost>>(
    `/connector/api/ecommerce/blogs/${slug}?business_id=${BUSINESS_ID}`,
  ).then((r) => r.data)

export function useBlog(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlog(slug!),
    enabled: !!slug,
    staleTime: 60_000,
    retry: (count, err) =>
      err instanceof Error && err.message.includes('404') ? false : count < 1,
  })
}

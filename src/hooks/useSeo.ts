import { useEffect } from 'react'
import type { BlogSeo } from '../api/storefront'

const DATA_ATTR = 'data-seo-injected'

/** Rewrite the API origin to the storefront's own origin (canonical/og.url). */
const fixOrigin = (url: string | null | undefined) =>
  url ? url.replace(/^https?:\/\/[^/]+/, window.location.origin) : url

/**
 * Injects a BlogSeo object into <head> 1:1 — no recomputation.
 * Tags that already existed are restored on unmount; tags we created are removed.
 */
export function useSeo(seo: BlogSeo | null | undefined) {
  useEffect(() => {
    if (!seo) return

    const disposers: (() => void)[] = []

    /** Upserts an element matching `selector`; registers a disposer that undoes it. */
    const upsert = <T extends HTMLElement>(
      selector: string,
      create: () => T,
      apply: (el: T) => void,
    ) => {
      const existing = document.head.querySelector<T>(selector)
      let el: T
      if (existing) {
        el = existing
        const prev = el.getAttribute('content') ?? el.getAttribute('href')
        const prevAttr = el.getAttribute('content') != null ? 'content' : 'href'
        disposers.push(() => {
          if (prev == null) el.removeAttribute(prevAttr)
          else el.setAttribute(prevAttr, prev)
        })
      } else {
        el = create()
        el.setAttribute(DATA_ATTR, 'true')
        document.head.appendChild(el)
        disposers.push(() => el.parentNode?.removeChild(el))
      }
      apply(el)
    }

    const setMeta = (selector: string, keyAttr: 'name' | 'property', key: string, content: string) =>
      upsert<HTMLMetaElement>(
        selector,
        () => document.createElement('meta'),
        (el) => {
          el.setAttribute(keyAttr, key)
          el.setAttribute('content', content)
        },
      )

    const previousTitle = document.title
    document.title = seo.title
    disposers.push(() => {
      document.title = previousTitle
    })

    if (seo.description) {
      setMeta('meta[name="description"]', 'name', 'description', seo.description)
    }
    if (seo.keywords?.length) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', seo.keywords.join(', '))
    }
    if (seo.robots) {
      setMeta('meta[name="robots"]', 'name', 'robots', seo.robots)
    }
    if (seo.canonical) {
      upsert<HTMLLinkElement>(
        'link[rel="canonical"]',
        () => document.createElement('link'),
        (el) => {
          el.setAttribute('rel', 'canonical')
          el.setAttribute('href', fixOrigin(seo.canonical) ?? '')
        },
      )
    }

    setMeta('meta[property="og:title"]', 'property', 'og:title', seo.og.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', seo.og.description)
    if (seo.og.image) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', seo.og.image)
    }
    if (seo.og.url) {
      setMeta('meta[property="og:url"]', 'property', 'og:url', fixOrigin(seo.og.url) ?? '')
    }
    setMeta('meta[property="og:type"]', 'property', 'og:type', seo.og.type)

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', seo.twitter.card)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.twitter.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.twitter.description)
    if (seo.twitter.image) {
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', seo.twitter.image)
    }

    if (seo.article?.published_time) {
      setMeta('meta[property="article:published_time"]', 'property', 'article:published_time', seo.article.published_time)
    }
    if (seo.article?.modified_time) {
      setMeta('meta[property="article:modified_time"]', 'property', 'article:modified_time', seo.article.modified_time)
    }

    if (seo.structured_data) {
      const ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.setAttribute(DATA_ATTR, 'true')
      ld.textContent = JSON.stringify(seo.structured_data)
      document.head.appendChild(ld)
      disposers.push(() => ld.parentNode?.removeChild(ld))
    }

    return () => {
      disposers.forEach((dispose) => dispose())
    }
  }, [seo])
}

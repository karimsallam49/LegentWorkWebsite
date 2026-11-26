// In dev, requests go same-origin through the Vite proxy (avoids CORS).
// In production they go directly to VITE_API_BASE_URL.
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID ?? ''

/** True when a business_id is configured and storefront endpoints should be queried. */
export const STOREFRONT_ENABLED = BUSINESS_ID !== ''

/** Google Apps Script web-app URL that relays the careers form to email. */
export const EMAIL_RELAY_URL = import.meta.env.VITE_EMAIL_RELAY_URL ?? ''

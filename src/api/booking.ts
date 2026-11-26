import { useQuery } from '@tanstack/react-query'
import { BUSINESS_ID } from '../config'
import { request } from './client'
import type {
  AddCarPayload,
  ApiResponse,
  BookingPayload,
  BookingResult,
  Branch,
  Brand,
  CarModel,
  CustomerCar,
  GuestBookingPayload,
  Service,
} from './types'

/* ---------- Cars ---------- */

export const getBrands = () =>
  request<ApiResponse<Brand[]>>(
    `/connector/api/booking/brands?business_id=${BUSINESS_ID}`,
  ).then((r) => r.data)

export const getModels = (brandId: number) =>
  request<ApiResponse<CarModel[]>>(
    `/connector/api/booking/models/${brandId}?business_id=${BUSINESS_ID}`,
  ).then((r) => r.data)

export const getCustomerCars = (customerId: number) =>
  request<ApiResponse<CustomerCar[]>>(`/connector/api/customers/${customerId}/cars`).then(
    (r) => r.data,
  )

export const addCar = (customerId: number, payload: AddCarPayload) =>
  request<ApiResponse<CustomerCar>>(`/connector/api/customers/${customerId}/cars`, {
    method: 'POST',
    body: payload,
  }).then((r) => r.data)

export function useBrands() {
  return useQuery({ queryKey: ['brands', BUSINESS_ID], queryFn: getBrands, staleTime: 300_000 })
}

export function useModels(brandId: number | null) {
  return useQuery({
    queryKey: ['models', brandId],
    queryFn: () => getModels(brandId!),
    enabled: brandId != null,
    staleTime: 300_000,
  })
}

/* ---------- Booking ---------- */

export const getBranches = () =>
  request<ApiResponse<Branch[]>>(
    `/connector/api/booking/locations?business_id=${BUSINESS_ID}`,
  ).then((r) => r.data)

export function useBranches() {
  return useQuery({ queryKey: ['branches'], queryFn: getBranches, staleTime: 300_000 })
}

/**
 * Public guest-booking services endpoint — one `location_id` per call, so a
 * master branch fans out to all its locations and merges. Handles wrapped
 * `{ success, data }` and raw responses, array or map shapes.
 */
async function getServices(locationIds: number[]): Promise<Service[]> {
  if (locationIds.length === 0) return []
  const lists = await Promise.all(
    locationIds.map(async (id) => {
      const res = await request<
        ApiResponse<Service[] | Record<string, Service[]>> | Record<string, Service[]>
      >(`/connector/api/booking/services?business_id=${BUSINESS_ID}&location_id=${id}`)
      const data =
        res && typeof res === 'object' && 'data' in res
          ? res.data
          : (res as Record<string, Service[]>)
      return Array.isArray(data) ? data : Object.values(data ?? {}).flat()
    }),
  )
  const seen = new Set<number>()
  return lists.flat().filter((s) => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
}

export function useServices(locationIds: number[]) {
  return useQuery({
    queryKey: ['services', locationIds],
    queryFn: () => getServices(locationIds),
    enabled: locationIds.length > 0,
    staleTime: 60_000,
  })
}

export const createBooking = (payload: BookingPayload) =>
  request<ApiResponse<BookingResult[]>>('/connector/api/add/booking', {
    method: 'POST',
    body: payload,
  }).then((r) => r.data)

/* ---------- Guest booking (public /booking endpoint, no auth needed) ---------- */

export const createGuestBooking = (payload: GuestBookingPayload) =>
  request<
    ApiResponse<BookingResult[] | BookingResult | Record<string, unknown>>
  >('/connector/api/booking', {
    method: 'POST',
    body: payload,
  }).then((r) => {
    const d = r.data as unknown
    return Array.isArray(d) ? (d as BookingResult[]) : d ? [d as BookingResult] : []
  })

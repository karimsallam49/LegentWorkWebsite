export interface ApiResponse<T> {
  success: boolean
  message?: string
  token?: string
  data: T
}

export interface AuthUser {
  id: number
  name: string
  email: string
  mobile: string
  token: string
}

export interface CustomerCar {
  id: number
  model: string
  brand_name?: string
  car_brand?: string
  make?: string
  vin_model_code?: string
  device?: string
  car_logo?: string
  car_image?: string
  color?: string
  plate_number: string
  manufacturing_year?: string
  chassis_number?: string
  car_type?: string
  motor_cc?: string
  model_image?: string
  tax?: number
}

export interface CustomerInfo {
  id: number
  first_name?: string
  last_name?: string
  name: string
  email?: string
  mobile: string
  cars: CustomerCar[]
}

export interface Brand {
  id: number
  name: string
  name_ar?: string
  logo?: string
}

export interface CarModel {
  id: number
  name: string
  name_ar?: string
}

export interface AddCarPayload {
  car_brand_id: number
  car_model_id: number
  model?: string
  plate_number: string
  manufacturing_year?: string
  color?: string
  chassis_number?: string
  motor_cc?: string
}

export interface BranchSettings {
  is_car_service?: boolean
  is_master?: boolean
  master_branch_ids?: number[]
  is_visible?: boolean
  title?: string | null
  title_ar?: string | null
  address?: string | null
  logo?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface Branch {
  id: number
  name: string
  latitude?: number | null
  longitude?: number | null
  coverage?: string | null
  address?: string | null
  is_car_station?: boolean
  is_car_service?: boolean
  website_settings?: BranchSettings | null
}

export interface Service {
  id: number
  name: string
  name_en?: string | null
  mobile?: string
  duration?: number
  price?: number
  priceFrom?: number
  country_code?: string
  currency_code?: string
  currency_symbol?: string
  icon?: string
}

export interface BookingPayload {
  location_id: number
  service_id?: number
  service_ids?: number[]
  booking_start: string
  device_id?: number
  booking_note: string
  send_notification: boolean
}

export interface GuestBookingPayload {
  business_id: number
  location_id?: number
  service_id?: number
  name: string
  mobile: string
  email?: string
  booking_date: string
  booking_time: string
  notes?: string
  send_notification: boolean
  brand_id?: number
  model_id?: number
  manufacturing_year?: string
  color?: string
  plate_number?: string
  car_type?: string
}

export interface BookingResult {
  booking_id: number
  location_id: number
  location_name: string
  service_id: number
  service_name: string
  booking_name: string
  booking_status: string
  duplicated: boolean
}

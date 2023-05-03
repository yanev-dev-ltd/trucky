import { UniqueIdentifier } from '@dnd-kit/core'
import { Driver } from '@/components/drivers/types'
import { Order } from '@/components/orders/types'
export type RouteProps = {
    vehicleId?: string
    units?: string
    routeId?: string
    drivers?: string[]
}

export type Route = {
    drivers?: string[]
    fuelConsumption?: number
    locations?: Location[]
    orders?: Order[]
}

export type Location = {
    address?: string,
    lat?: number,
    lng?: number,
    loading?: boolean,
    unloading?: boolean,
    parking?: boolean,
    refueling?: boolean
    id?: UniqueIdentifier
}
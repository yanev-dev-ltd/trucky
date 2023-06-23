import { UniqueIdentifier } from '@dnd-kit/core'
import { Order } from '@/components/orders/types'
export type RouteProps = {
    vehicleId?: string
    units?: string
    routeId?: string
    drivers?: string[]
}

export type Route = {
    key?: string
    drivers?: string[]
    fuelConsumption?: number
    locations?: Location[]
    orders?: Order[]
    startDate?: number
    endDate?: number
    distance?: number[]
    toll?: number[]
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
    code?: string
    key?: string
}

export type Update = {
    [x: string]: any
}
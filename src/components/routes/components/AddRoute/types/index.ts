import { UniqueIdentifier } from '@dnd-kit/core'
import { Driver } from '@/components/drivers/types'
export type AddRouteProps = {
    vehicleId?: string
    units?: string
}

export type Route = {
    drivers?: Driver[]
    fuelConsumption?: number
    locations?: Location[]
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
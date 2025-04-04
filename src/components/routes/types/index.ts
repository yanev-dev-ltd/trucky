import { UniqueIdentifier } from '@dnd-kit/core'
import { Order } from '@/components/orders/types'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { MutableRefObject } from 'react'
import { Driver } from '@/components/drivers/types'
import { Vehicle } from '@/components/vehicles/types'
export type RouteProps = {
    vehicleId?: string
    units?: string
    routeId?: string
    drivers?: string[]
    onClose?: () => void
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
    ferry?: boolean[]
    vehicleId?: string
    groups?: string[]
    currency?: string
    units?: string
    trailerId?: string
}

export type Routes = Route[]

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

export type RoutesProps = {
    routes: Routes
    routeId?: string
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Route>
    columns: Column<Route>[]
    drivers: Driver[]
    vehicles: Vehicle[]
}

export type useRoutesProps = {
    routeId?: string
}
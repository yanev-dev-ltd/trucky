import { Location } from '@/components/routes/types'
import React, { MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { Vehicle } from '@/components/vehicles/types'

export type Order = {
    key?: string
    startStop?: Location
    endStop?: Location
    reference?: string
    weight?: number
    type?: string
    notes?: string
    vehicleId?: string
    routeId?: string
    userId?: string
    shouldDelete?: boolean
    client?: string
    groups?: string[]
    secondary?: string | React.ReactNode
    dateCompletion?: number
    dateExecution?: number
    palletsCount?: number
    temperatureRegime?: number
}

export type useOrdersProps = {
    orderId?: string
}

export type OrdersProps = {
    orders: Order[]
    orderId?: string
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Order>
    columns: Column<Order>[]
    vehicles: Vehicle[]
    locations: Location[]
    deleteOrder: () => void
}
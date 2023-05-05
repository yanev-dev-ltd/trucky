import { ReactNode, MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'

export type Driver = {
    key: string
    name?: string
    phone?: string
    address?: string
    new?: ReactNode
}

export type useDriversProps = {
    driverId: string | undefined
}

export type DriversProps = {
    driverId: string | undefined
    drivers: Driver[],
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Driver>
    columns: Column<Driver>[]
}
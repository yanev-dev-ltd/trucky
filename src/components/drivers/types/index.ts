import { ReactNode, MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { UploadedFile } from '@/components/common/Upload/types'

export type Driver = {
    key: string
    name?: string
    phone?: string
    address?: string
    new?: ReactNode
    files?: string
    notes?: string
}

export type useDriversProps = {
    driverId: string | undefined
    edit?: string | undefined
}

export type DriversProps = {
    driverId: string | undefined
    edit?: string | undefined
    drivers: Driver[],
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Driver>
    columns: Column<Driver>[]
}
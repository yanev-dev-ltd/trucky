import { MutableRefObject, ReactNode } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { Maintenances } from '@/components/maintenance/types'
export type Trailers = Trailer[]

export type Trailer = {
    key: string
    mileage?: number
    units?: string
    name?: string
    type?: TrailerTypes
    files?: string
    maintenance?: Maintenances
    notes?: string
    new?: ReactNode
    groups?: string[]
}

export type useTrailersProps = {
    trailerId: string | undefined
    edit: string | undefined
}

export type TrailersProps = {
    trailerId: string | undefined
    trailers: Trailers,
    edit: string | undefined
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Trailer>
    columns: Column<Trailer>[]
}

export enum TrailerTypes {
    SEMITRAILER = 'Semitrailer',
    TRAILER = 'Trailer',
    FLATBED_TRAILER = 'FlatbedTrailer',
    DRY_VAN_TRAILER = 'DryVanTrailer',
    REFRIGERATED_TRAILER = 'RefrigeratedTrailer',
    STEP_DECK_TRAILER = 'StepDeckTrailer',
    EXTENDABLE_FLATBED_TRAILER = 'ExtendableFlatbedTrailer',
    REMOVABLE_GOOSENECK_TRAILER = 'RemovableGooseneckTrailer',
    CONESTOGA_TRAILER = 'ConestogaTrailer',
    DUMP_TRAILER = 'DumpTrailer',
    SIDE_KIT_TRAILER = 'SideKitTrailer',
    TANK_TRAILER = 'TankTrailer'
}
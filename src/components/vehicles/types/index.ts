import { tr } from 'date-fns/locale';
import { MutableRefObject, ReactNode } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { Driver } from '@/components/drivers/types'
import { Maintenances } from '@/components/maintenance/types'
import { Trailer } from '@/components/trailers/types';
export type Vehicles = Vehicle[]

export type Vehicle = {
    key: string
    drivers?: string[]
    mileage?: number
    name?: string
    type?: VehicleTypes
    fuel?: FuelTypes
    units?: string
    route?: string
    files?: string
    maintenance?: Maintenances
    notes?: string
    new?: ReactNode
    groups?: string[]
    trailer?: string | null
}

export type useVehicleProps = {
    vehicleId: string | undefined
    edit: string | undefined
    routeId: string | undefined
}

export type VehicleProps = {
    vehicleId: string | undefined
    vehicles: Vehicles,
    edit: string | undefined
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Vehicle>
    columns: Column<Vehicle>[]
    routeId: string | undefined
    drivers: Driver[]
    trailers: Trailer[]
}

export enum VehicleTypes {
    BULLDOZER = 'Bulldozer',
    BUS = 'Bus',
    CAR = 'Car',
    CARAVAN = 'Caravan',
    CEMENT_MIXER = 'CementMixer',
    CRANE = 'Crane',
    DUMP_TRUCK = 'DumpTruck',
    EXCAVATOR = 'Excavator',
    FORKLIFT = 'Forklift',
    LIGHT_DUTY_TRUCK = 'LightDutyTruck',
    PICKUP_TRUCK = 'PickupTruck',
    ROAD_TRACTOR = 'RoadTractor',
    TAXI = 'Taxi',
    TOW_TRUCK = 'TowTruck',
    TRACTOR = 'Tractor',
    TRUCK = 'Truck',
    VAN = 'Van',
}

export enum FuelTypes {
    GASOLINE = 'Gasoline',
    DIESEL = 'Diesel',
    NATURAL_GAS = 'NaturalGas',
    METHANOL = 'Methanol',
    METHANE = 'Methane',
    KEROSINE = 'Kerosine',
    HYDROGEN = 'Hydrogen',
    HYBRID = 'Hybrid',
    ELECTRIC = 'Electric',
}
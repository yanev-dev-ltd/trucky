import { MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { Driver } from '@/components/drivers/types'
export type Vehicles = Vehicle[]

export type Vehicle = {
    key: string
    drivers?: string[]
    mileage?: number
    name?: string
    type?: keyof VehicleTypes
    fuel?: keyof FuelTypes
    units?: string
    route?: string
    files?: VehicleFile[]
    services?: Service[]
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
}

export type Service = {
    cost?: number | string | null
    date?: number | null
    drivers?: string[]
    mileage?: number | null
    place?: string
    reminderDate?: number | null
    reminderMileage?: number | null
    type?: string
    part?: string
    key?: string
    vehicle?: string
}


export type Services = Service[]

export type VehicleFile = {
    name: string
    path: string
    url: string
    date: number
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
    SEMITRAILER = 'Semitrailer',
    TAXI = 'Taxi',
    TRACTOR = 'Tractor',
    TRAILER = 'Trailer',
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
    ELECTRIC = 'Electric'
}
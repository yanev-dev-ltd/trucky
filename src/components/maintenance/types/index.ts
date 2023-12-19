import { ReactNode, MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'

export type Maintenance = {
    cost?: number | string | null
    date?: number | null
    drivers?: string[] | null
    mileage?: number | null
    place?: string
    reminderDate?: number | null
    reminderMileage?: number | null
    type?: string
    part?: string
    key?: string
    vehicleId?: string
    userId?: string
    description?: string
    units?: string
}

export type Maintenances = Maintenance[]

export type useMaintenanceProps = {
    maintenanceId: string | undefined
    edit?: string | undefined
}

export type MaintenanceProps = {
    maintenanceId: string | undefined
    edit?: string | undefined
    maintenances: Maintenances,
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Maintenance>
    columns: Column<Maintenance>[]
}

export enum MaintenanceTypes {
    OIL_CHANGE = 'oil_change',
    TIRE_CHANGE = 'tire_change',
    TIRE_ROTATION = 'tire_rotation',
    WHEEL_BALANCE = 'wheel_balance',
    WHEEL_ALIGNMENT = 'wheel_alignment',
    BRAKE_PADS_CHANGE = 'brake_pads_change',
    BRAKE_DISCS_CHANGE = 'brake_discs_change',
    BRAKE_FLUID_CHANGE = 'brake_fluid_change',
    BATTERY_CHANGE = 'battery_change',
    AIR_FILTER_CHANGE = 'air_filter_change',
    FUEL_FILTER_CHANGE = 'fuel_filter_change',
    SPARK_PLUGS_CHANGE = 'spark_plugs_change',
    ENGINE_COOLANT_CHANGE = 'engine_coolant_change',
    TRANSMISSION_OIL_CHANGE = 'transmission_oil_change',
    TRANSMISSION_FILTER_CHANGE = 'transmission_filter_change',
    TRANSMISSION_FLUID_CHANGE = 'transmission_fluid_change',
    POWER_STEERING_FLUID_CHANGE = 'power_steering_fluid_change',
    SUSPENSION_CHANGE = 'suspension_change',
    // OTHER = 'other'
}
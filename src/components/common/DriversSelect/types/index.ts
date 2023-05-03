import { Driver } from '@/components/drivers/types'

export type useDriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: Driver[]) => void,
}

export type DriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: Driver[]) => void,
    allDrivers: Driver[],
}
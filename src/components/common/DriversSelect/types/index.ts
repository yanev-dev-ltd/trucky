import { Driver } from '@/components/drivers/types'

export type useDriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: string[]) => void,
}

export type DriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: string[]) => void,
    allDrivers: Driver[],
}
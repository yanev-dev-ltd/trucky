import { Driver } from '@/components/drivers/types'
import { SxProps, Theme } from '@mui/material'

export type useDriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: string[]) => void,
    sx?: SxProps<Theme>
}

export type DriversSelectProps = {
    drivers?: string[],
    setDrivers: (driver: string[]) => void,
    allDrivers: Driver[],
    sx?: SxProps<Theme>
}
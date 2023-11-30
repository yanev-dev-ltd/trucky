import { setVehicles } from '@/components/vehicles/redux';
import { Vehicle } from '@/components/vehicles/types';
import { Driver } from '@/components/drivers/types'
import { SxProps, Theme } from '@mui/material'

export type useVehiclesSelectProps = {
    vehicles?: string[],
    setVehicles: (vehicle: string[] | string) => void,
    sx?: SxProps<Theme>
    multiple?: boolean
}

export type VehiclesSelectProps = {
    vehicles?: Vehicle[] | Vehicle,
    setVehicles: (vehicles: string[] | string) => void,
    allVehicles: Vehicle[],
    sx?: SxProps<Theme>
    multiple?: boolean
}
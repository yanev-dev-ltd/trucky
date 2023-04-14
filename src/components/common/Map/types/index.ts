import { Location } from '@/components/routes/components/AddRoute/types'
import { SxProps, Theme } from '@mui/material'
export type useMap = {
    locations: Location[]
}

export type useMapProps = {
    locations: Location[]
    setDistance?: (distance: number[]) => void
    setToll?: (toll: number[]) => void
    setFerry?: (ferry: boolean[]) => void
}

export type MapProps = {
    locations: Location[]
    sx?: SxProps<Theme>
    setDistance?: (number: number[]) => void
    setToll?: (number: number[]) => void
    setFerry?: (ferry: boolean[]) => void
}
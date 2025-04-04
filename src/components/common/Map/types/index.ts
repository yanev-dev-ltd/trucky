import { Location } from '@/components/routes/types'
import { SxProps, Theme } from '@mui/material'
export type useMap = {
    locations: Location[]
}

export type useMapProps = {
    locations: Location[]
    changeField: (field: string, value: any) => void
    setNoRoute?: (noRoute: boolean) => void
    setLoading?: (loading: boolean) => void
    mode: 'truck' | 'car'
    currency: string
    units: string
}

export type MapProps = {
    locations: Location[]
    sx?: SxProps<Theme>
    changeField: (field: string, value: any) => void
    setNoRoute?: (noRoute: boolean) => void
    setLoading?: (loading: boolean) => void
    mode: 'truck' | 'car'
    currency: string
    units: string
}
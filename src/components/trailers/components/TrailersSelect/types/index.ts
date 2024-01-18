import { Trailer, TrailerTypes } from '@/components/trailers/types';
import { SxProps, Theme } from '@mui/material'

export type useTrailersSelectProps = {
    trailers?: string[],
    setTrailers: (trailer: string[] | string) => void,
    sx?: SxProps<Theme>
    multiple?: boolean
    type?: TrailerTypes
}

export type TrailersSelectProps = {
    trailers?: Trailer[] | Trailer,
    setTrailers: (trailers: string[] | string) => void,
    allTrailers: Trailer[],
    sx?: SxProps<Theme>
    multiple?: boolean
    type?: TrailerTypes
}
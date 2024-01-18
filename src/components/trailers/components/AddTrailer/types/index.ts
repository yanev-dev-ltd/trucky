import { TrailerTypes } from '@/components/trailers/types'

export type useAddTrailerProps = {
    onSave: (trailerId: string) => void
    setOpen: (open: boolean) => void
    open: boolean
    changeField?: (field: keyof NewTrailer, value: string) => void
    newTrailer?: NewTrailer | undefined
    newTrailerLoading?: boolean
    redirectToEdit?: boolean
}
export type AddTrailerProps = {
    open: boolean
    handleClose: () => void
    handleAddTrailer: () => void
    changeField: (field: keyof NewTrailer, value: string) => void
    addTrailer: () => void
    newTrailer: NewTrailer | undefined
    newTrailerLoading: boolean
}
export type NewTrailer = {
    name?: string
    type?: TrailerTypes
    units: string
    userId?: string
}
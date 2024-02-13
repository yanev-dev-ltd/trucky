import { Trailer } from '../../../types'
import { Maintenances } from '@/components/maintenance/types'
export type EditTrailerProps = {
    trailer: Trailer | undefined
    edit: string | undefined
}

export type useEditTrailerResponse = {
    saveTrailerField: (field: keyof Trailer) => void
    editedTrailer: Trailer | undefined
    setEditedTrailer: (trailer: Trailer | undefined) => void
    reset: () => void
    deleteTrailer: () => void
    maintenances: Maintenances
}